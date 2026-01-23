"""
Contract Analysis NLP Pipeline
AI-powered legal document analysis with high accuracy (F1 > 0.9)

Key Features:
- Extract termination terms, indemnity caps, and SLA clauses
- Detect deviations from standard templates
- Generate plain-English summaries for non-legal staff
- Support for PDF, DOCX, and TXT documents up to 80 pages

Usage:
    from contract_analysis import ContractAnalyzer, DocumentProcessor
    
    # Initialize
    processor = DocumentProcessor()
    analyzer = ContractAnalyzer()
    
    # Process document
    text, metadata = processor.process("contract.pdf")
    
    # Analyze
    result = analyzer.analyze(text, "doc_id", metadata.total_pages)
    
    # Access results
    print(f"Found {len(result.clauses)} clauses")
    print(f"Deviations: {sum(1 for c in result.clauses if c.is_deviation)}")
"""

from .contract_analyzer import (
    ContractAnalyzer,
    ClauseExtractor,
    DeviationDetector,
    ObligationSummarizer,
    Clause,
    ContractAnalysisResult
)

from .document_processor import (
    DocumentProcessor,
    TextPreprocessor,
    DocumentMetadata
)

__version__ = "1.0.0"
__author__ = "SymboTalk AI Team"

__all__ = [
    'ContractAnalyzer',
    'ClauseExtractor',
    'DeviationDetector',
    'ObligationSummarizer',
    'Clause',
    'ContractAnalysisResult',
    'DocumentProcessor',
    'TextPreprocessor',
    'DocumentMetadata',
]
