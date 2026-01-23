"""
Flask API for Contract Analysis
Provides RESTful endpoints for document upload and analysis
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
import uuid
from datetime import datetime
from dataclasses import asdict

from contract_analyzer import ContractAnalyzer, Clause, ContractAnalysisResult
from document_processor import DocumentProcessor, TextPreprocessor


# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend integration

# Configuration
# Note: For production, use secure persistent storage with proper permissions
# For development/testing, /tmp is acceptable
UPLOAD_FOLDER = os.getenv('CONTRACT_UPLOAD_FOLDER', '/tmp/contract_uploads')
RESULTS_FOLDER = os.getenv('CONTRACT_RESULTS_FOLDER', '/tmp/contract_results')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(RESULTS_FOLDER, exist_ok=True)

# Initialize components
document_processor = DocumentProcessor(max_pages=80)
text_preprocessor = TextPreprocessor()
contract_analyzer = ContractAnalyzer()


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'Contract Analysis API',
        'version': '1.0.0',
        'timestamp': datetime.utcnow().isoformat()
    })


@app.route('/api/analyze', methods=['POST'])
def analyze_contract():
    """
    Analyze a contract document
    
    Request:
        - file: Contract document (PDF, DOCX, or TXT)
        - template_type: Optional template type for deviation detection
    
    Response:
        - document_id: Unique identifier for the analysis
        - clauses: Extracted clauses with metadata
        - summary: Contract summary and obligations
        - metrics: Performance metrics including F1 score
    """
    try:
        # Validate request
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Generate unique document ID
        document_id = str(uuid.uuid4())
        
        # Save uploaded file
        file_ext = os.path.splitext(file.filename)[1].lower()
        file_path = os.path.join(UPLOAD_FOLDER, f"{document_id}{file_ext}")
        file.save(file_path)
        
        # Validate document
        is_valid, error_msg = document_processor.validate_document(file_path)
        if not is_valid:
            os.remove(file_path)
            return jsonify({'error': error_msg}), 400
        
        # Process document
        text, metadata = document_processor.process(file_path)
        
        # Clean text
        cleaned_text = text_preprocessor.clean_text(text)
        
        # Analyze contract
        result = contract_analyzer.analyze(
            text=cleaned_text,
            document_id=document_id,
            total_pages=metadata.total_pages
        )
        
        # Convert result to JSON-serializable format
        response_data = {
            'document_id': result.document_id,
            'metadata': {
                'filename': metadata.filename,
                'file_type': metadata.file_type,
                'total_pages': metadata.total_pages,
                'word_count': metadata.word_count,
                'processing_time': result.processing_time
            },
            'clauses': [
                {
                    'clause_type': clause.clause_type,
                    'text': clause.text[:500] + '...' if len(clause.text) > 500 else clause.text,
                    'page_number': clause.page_number,
                    'confidence': round(clause.confidence, 3),
                    'obligations': clause.obligations,
                    'is_deviation': clause.is_deviation,
                    'deviation_notes': clause.deviation_notes
                }
                for clause in result.clauses
            ],
            'summary': result.summary,
            'metrics': {
                'total_clauses_extracted': len(result.clauses),
                'clauses_by_type': {
                    'termination': sum(1 for c in result.clauses if c.clause_type == 'termination'),
                    'indemnity': sum(1 for c in result.clauses if c.clause_type == 'indemnity'),
                    'sla': sum(1 for c in result.clauses if c.clause_type == 'sla')
                },
                'deviations_found': sum(1 for c in result.clauses if c.is_deviation),
                'average_confidence': round(
                    sum(c.confidence for c in result.clauses) / len(result.clauses),
                    3
                ) if result.clauses else 0
            }
        }
        
        # Save results
        result_path = os.path.join(RESULTS_FOLDER, f"{document_id}.json")
        with open(result_path, 'w') as f:
            json.dump(response_data, f, indent=2)
        
        # Clean up uploaded file
        os.remove(file_path)
        
        return jsonify(response_data), 200
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500


@app.route('/api/results/<document_id>', methods=['GET'])
def get_results(document_id):
    """
    Retrieve analysis results for a document
    
    Args:
        document_id: Unique document identifier
    
    Response:
        Complete analysis results
    """
    try:
        result_path = os.path.join(RESULTS_FOLDER, f"{document_id}.json")
        
        if not os.path.exists(result_path):
            return jsonify({'error': 'Results not found'}), 404
        
        with open(result_path, 'r') as f:
            results = json.load(f)
        
        return jsonify(results), 200
        
    except Exception as e:
        return jsonify({'error': f'Error retrieving results: {str(e)}'}), 500


@app.route('/api/clauses/<document_id>', methods=['GET'])
def get_clauses(document_id):
    """
    Get specific clause types from analysis results
    
    Query parameters:
        - type: Clause type (termination, indemnity, sla)
        - deviations_only: Return only clauses with deviations (true/false)
    """
    try:
        result_path = os.path.join(RESULTS_FOLDER, f"{document_id}.json")
        
        if not os.path.exists(result_path):
            return jsonify({'error': 'Results not found'}), 404
        
        with open(result_path, 'r') as f:
            results = json.load(f)
        
        clauses = results['clauses']
        
        # Apply filters
        clause_type = request.args.get('type')
        if clause_type:
            clauses = [c for c in clauses if c['clause_type'] == clause_type]
        
        deviations_only = request.args.get('deviations_only', '').lower() == 'true'
        if deviations_only:
            clauses = [c for c in clauses if c['is_deviation']]
        
        return jsonify({
            'document_id': document_id,
            'filtered_clauses': clauses,
            'count': len(clauses)
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Error retrieving clauses: {str(e)}'}), 500


@app.route('/api/summary/<document_id>', methods=['GET'])
def get_summary(document_id):
    """
    Get simplified summary for non-legal staff
    
    Response:
        - overview: High-level contract overview
        - key_obligations: Main obligations by type
        - risk_areas: Identified risks and recommendations
        - action_items: Time-sensitive action items
    """
    try:
        result_path = os.path.join(RESULTS_FOLDER, f"{document_id}.json")
        
        if not os.path.exists(result_path):
            return jsonify({'error': 'Results not found'}), 404
        
        with open(result_path, 'r') as f:
            results = json.load(f)
        
        summary = results['summary']
        
        # Create simplified summary for non-legal staff
        simplified_summary = {
            'executive_summary': {
                'document': results['metadata']['filename'],
                'pages': results['metadata']['total_pages'],
                'clauses_found': summary['overview']['total_clauses'],
                'concerns': summary['overview']['deviations_found']
            },
            'what_you_need_to_know': {
                'key_obligations': summary['key_obligations'],
                'important_deadlines': summary['action_items'][:5],
                'areas_of_concern': summary['risk_areas'][:5]
            },
            'recommendations': [
                risk['recommendation'] for risk in summary['risk_areas'][:3]
            ],
            'next_steps': [
                'Review highlighted risk areas with legal counsel',
                'Address any deviations from standard templates',
                'Mark calendar for time-sensitive obligations'
            ]
        }
        
        return jsonify(simplified_summary), 200
        
    except Exception as e:
        return jsonify({'error': f'Error generating summary: {str(e)}'}), 500


@app.route('/api/evaluate', methods=['POST'])
def evaluate_extraction():
    """
    Evaluate extraction accuracy against ground truth
    
    Request:
        - document_id: Document to evaluate
        - ground_truth: List of ground truth clauses
    
    Response:
        - metrics: Precision, recall, F1 score by clause type
    """
    try:
        data = request.get_json()
        
        if not data or 'document_id' not in data or 'ground_truth' not in data:
            return jsonify({'error': 'Missing required fields'}), 400
        
        document_id = data['document_id']
        ground_truth_data = data['ground_truth']
        
        # Load predicted results
        result_path = os.path.join(RESULTS_FOLDER, f"{document_id}.json")
        
        if not os.path.exists(result_path):
            return jsonify({'error': 'Results not found'}), 404
        
        with open(result_path, 'r') as f:
            results = json.load(f)
        
        # Convert to Clause objects
        predicted_clauses = [
            Clause(
                clause_type=c['clause_type'],
                text=c['text'],
                page_number=c['page_number'],
                confidence=c['confidence'],
                start_position=0,  # Not stored in simplified format
                end_position=0,
                obligations=c['obligations'],
                is_deviation=c['is_deviation'],
                deviation_notes=c.get('deviation_notes')
            )
            for c in results['clauses']
        ]
        
        ground_truth_clauses = [
            Clause(
                clause_type=c['clause_type'],
                text=c['text'],
                page_number=c['page_number'],
                confidence=1.0,
                start_position=c.get('start_position', 0),
                end_position=c.get('end_position', 0),
                obligations=[],
                is_deviation=False
            )
            for c in ground_truth_data
        ]
        
        # Evaluate
        metrics = contract_analyzer.evaluate(predicted_clauses, ground_truth_clauses)
        
        return jsonify({
            'document_id': document_id,
            'evaluation_metrics': metrics,
            'meets_target': metrics['overall']['f1_score'] >= 0.9,
            'target_f1': 0.9
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Error evaluating: {str(e)}'}), 500


if __name__ == '__main__':
    print("Starting Contract Analysis API...")
    print(f"Upload folder: {UPLOAD_FOLDER}")
    print(f"Results folder: {RESULTS_FOLDER}")
    app.run(host='0.0.0.0', port=5000, debug=True)
