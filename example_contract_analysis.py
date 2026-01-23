"""
Complete Example: Contract Analysis Pipeline
Demonstrates all features of the contract analysis system
"""

import sys
import os

# Add contract_analysis to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'contract_analysis'))

from contract_analyzer import ContractAnalyzer, Clause
from document_processor import DocumentProcessor, TextPreprocessor


def print_section(title):
    """Print a formatted section header"""
    print("\n" + "=" * 80)
    print(f"  {title}")
    print("=" * 80 + "\n")


def example_basic_analysis():
    """Example 1: Basic contract analysis"""
    print_section("Example 1: Basic Contract Analysis")
    
    # Initialize components
    processor = DocumentProcessor(max_pages=80)
    preprocessor = TextPreprocessor()
    analyzer = ContractAnalyzer()
    
    # Path to sample contract
    sample_path = "contract_analysis/templates/sample_msa.txt"
    
    print(f"📄 Processing: {sample_path}")
    
    # Process document
    text, metadata = processor.process(sample_path)
    print(f"✓ Extracted {metadata.word_count} words from {metadata.total_pages} page(s)")
    
    # Clean text
    cleaned_text = preprocessor.clean_text(text)
    print(f"✓ Cleaned text ({len(cleaned_text)} characters)")
    
    # Analyze
    print("🔍 Analyzing contract...")
    result = analyzer.analyze(
        text=cleaned_text,
        document_id="example_basic",
        total_pages=metadata.total_pages
    )
    
    print(f"✓ Analysis complete in {result.processing_time:.2f} seconds")
    print(f"✓ Found {len(result.clauses)} clauses")
    
    # Show summary
    print("\n📊 Summary:")
    print(f"  - Termination clauses: {sum(1 for c in result.clauses if c.clause_type == 'termination')}")
    print(f"  - Indemnity clauses: {sum(1 for c in result.clauses if c.clause_type == 'indemnity')}")
    print(f"  - SLA clauses: {sum(1 for c in result.clauses if c.clause_type == 'sla')}")
    print(f"  - Deviations found: {sum(1 for c in result.clauses if c.is_deviation)}")


def example_deviation_analysis():
    """Example 2: Focus on deviations"""
    print_section("Example 2: Deviation Analysis")
    
    analyzer = ContractAnalyzer()
    processor = DocumentProcessor()
    
    sample_path = "contract_analysis/templates/sample_msa.txt"
    text, metadata = processor.process(sample_path)
    
    print("🔍 Analyzing for deviations from standard templates...")
    result = analyzer.analyze(
        text=TextPreprocessor.clean_text(text),
        document_id="example_deviations",
        total_pages=metadata.total_pages
    )
    
    # Filter for deviations
    deviations = [c for c in result.clauses if c.is_deviation]
    
    print(f"\n⚠️  Found {len(deviations)} deviation(s):\n")
    
    for i, clause in enumerate(deviations, 1):
        print(f"{i}. {clause.clause_type.upper()} (Page {clause.page_number})")
        print(f"   Confidence: {clause.confidence:.2%}")
        print(f"   Issue: {clause.deviation_notes}")
        print(f"   Preview: {clause.text[:150]}...")
        print()


def example_risk_assessment():
    """Example 3: Risk assessment focus"""
    print_section("Example 3: Risk Assessment")
    
    analyzer = ContractAnalyzer()
    processor = DocumentProcessor()
    
    sample_path = "contract_analysis/templates/sample_msa.txt"
    text, metadata = processor.process(sample_path)
    
    result = analyzer.analyze(
        text=TextPreprocessor.clean_text(text),
        document_id="example_risks",
        total_pages=metadata.total_pages
    )
    
    # Get risk areas from summary
    risks = result.summary['risk_areas']
    
    print(f"🔴 Identified {len(risks)} risk area(s):\n")
    
    for risk in risks:
        icon = "🔴" if risk['risk_level'] == 'HIGH' else "🟡"
        print(f"{icon} {risk['risk_level']} Risk - {risk['type'].upper()}")
        print(f"   Location: Page {risk['page']}")
        print(f"   Description: {risk['description']}")
        print(f"   Recommendation: {risk['recommendation']}")
        print()


def example_obligations_extraction():
    """Example 4: Extract obligations"""
    print_section("Example 4: Obligation Extraction")
    
    analyzer = ContractAnalyzer()
    processor = DocumentProcessor()
    
    sample_path = "contract_analysis/templates/sample_msa.txt"
    text, metadata = processor.process(sample_path)
    
    result = analyzer.analyze(
        text=TextPreprocessor.clean_text(text),
        document_id="example_obligations",
        total_pages=metadata.total_pages
    )
    
    # Extract all obligations
    all_obligations = []
    for clause in result.clauses:
        for obligation in clause.obligations:
            all_obligations.append({
                'type': clause.clause_type,
                'text': obligation,
                'page': clause.page_number
            })
    
    print(f"📋 Found {len(all_obligations)} obligation(s):\n")
    
    # Group by priority
    must_obligations = [o for o in all_obligations if '[MUST]' in o['text']]
    prohibited = [o for o in all_obligations if '[PROHIBITED]' in o['text']]
    should = [o for o in all_obligations if '[SHOULD]' in o['text']]
    
    print("🔴 MUST (Mandatory):")
    for obl in must_obligations[:3]:
        print(f"  - {obl['text']} (Page {obl['page']})")
    
    print(f"\n⛔ PROHIBITED:")
    for obl in prohibited[:3]:
        print(f"  - {obl['text']} (Page {obl['page']})")
    
    print(f"\n🟡 SHOULD (Recommended):")
    for obl in should[:3]:
        print(f"  - {obl['text']} (Page {obl['page']})")


def example_plain_english_summary():
    """Example 5: Plain English summary for non-legal staff"""
    print_section("Example 5: Plain English Summary")
    
    analyzer = ContractAnalyzer()
    processor = DocumentProcessor()
    
    sample_path = "contract_analysis/templates/sample_msa.txt"
    text, metadata = processor.process(sample_path)
    
    result = analyzer.analyze(
        text=TextPreprocessor.clean_text(text),
        document_id="example_summary",
        total_pages=metadata.total_pages
    )
    
    summary = result.summary
    
    print("📄 CONTRACT SUMMARY FOR NON-LEGAL STAFF\n")
    
    print("📊 Overview:")
    overview = summary['overview']
    print(f"  • Total clauses analyzed: {overview['total_clauses']}")
    print(f"  • Termination provisions: {overview['clause_breakdown'].get('termination', 0)}")
    print(f"  • Liability provisions: {overview['clause_breakdown'].get('indemnity', 0)}")
    print(f"  • Service level agreements: {overview['clause_breakdown'].get('sla', 0)}")
    print(f"  • Items requiring attention: {overview['deviations_found']}")
    
    print("\n⚠️  What You Need to Know:")
    print(summary['deviation_summary'])
    
    print("\n📋 Action Items:")
    for i, action in enumerate(summary['action_items'][:5], 1):
        print(f"  {i}. {action}")
    
    print("\n💡 Recommendations:")
    for risk in summary['risk_areas'][:3]:
        print(f"  • {risk['recommendation']}")


def example_api_simulation():
    """Example 6: Simulate API usage"""
    print_section("Example 6: API-Style Usage")
    
    from contract_analyzer import ContractAnalyzer
    from document_processor import DocumentProcessor, TextPreprocessor
    import json
    
    # Simulate API request
    print("📤 Simulating API request...")
    
    # Process
    processor = DocumentProcessor()
    analyzer = ContractAnalyzer()
    
    sample_path = "contract_analysis/templates/sample_msa.txt"
    text, metadata = processor.process(sample_path)
    cleaned_text = TextPreprocessor.clean_text(text)
    
    result = analyzer.analyze(cleaned_text, "api_example", metadata.total_pages)
    
    # Format as API response
    api_response = {
        'status': 'success',
        'document_id': result.document_id,
        'metadata': {
            'filename': metadata.filename,
            'pages': metadata.total_pages,
            'processing_time': f"{result.processing_time:.2f}s"
        },
        'results': {
            'total_clauses': len(result.clauses),
            'by_type': {
                'termination': sum(1 for c in result.clauses if c.clause_type == 'termination'),
                'indemnity': sum(1 for c in result.clauses if c.clause_type == 'indemnity'),
                'sla': sum(1 for c in result.clauses if c.clause_type == 'sla'),
            },
            'deviations': sum(1 for c in result.clauses if c.is_deviation),
            'high_confidence': sum(1 for c in result.clauses if c.confidence > 0.8)
        },
        'summary': {
            'overview': result.summary['overview'],
            'risk_count': len(result.summary['risk_areas'])
        }
    }
    
    print("✓ API Response:")
    print(json.dumps(api_response, indent=2))


def run_all_examples():
    """Run all examples"""
    print("\n" + "=" * 80)
    print("  CONTRACT ANALYSIS NLP PIPELINE - COMPLETE EXAMPLES")
    print("=" * 80)
    
    examples = [
        example_basic_analysis,
        example_deviation_analysis,
        example_risk_assessment,
        example_obligations_extraction,
        example_plain_english_summary,
        example_api_simulation,
    ]
    
    for example in examples:
        try:
            example()
        except Exception as e:
            print(f"\n❌ Error in {example.__name__}: {str(e)}")
            import traceback
            traceback.print_exc()
    
    print_section("All Examples Complete!")
    print("Next steps:")
    print("  1. Try analyzing your own contracts")
    print("  2. Start the API server: python contract_analysis/api.py")
    print("  3. Open contract_analysis.html in your browser")
    print("  4. Read the documentation: contract_analysis/README.md")


if __name__ == '__main__':
    run_all_examples()
