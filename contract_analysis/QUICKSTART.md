# Contract Analysis - Quick Start Guide

## 5-Minute Setup

### 1. Install Dependencies (1 minute)
```bash
cd contract_analysis
pip install numpy pandas scikit-learn
```

### 2. Test the System (2 minutes)
```bash
python test_analyzer.py
```

Expected output:
```
================================================================================
ALL TESTS PASSED ✅
================================================================================
```

### 3. Analyze Your First Contract (2 minutes)

#### Option A: Use the Web Interface
1. Open `contract_analysis.html` in your browser
2. Upload a contract (PDF, DOCX, or TXT)
3. Click "Analyze Contract"
4. Review results!

#### Option B: Use Python API
```python
from contract_analyzer import ContractAnalyzer
from document_processor import DocumentProcessor, TextPreprocessor

# Initialize components
processor = DocumentProcessor()
preprocessor = TextPreprocessor()
analyzer = ContractAnalyzer()

# Process your contract
text, metadata = processor.process("your_contract.pdf")
cleaned_text = preprocessor.clean_text(text)

# Analyze
result = analyzer.analyze(
    text=cleaned_text,
    document_id="my_contract",
    total_pages=metadata.total_pages
)

# View results
print(f"Found {len(result.clauses)} clauses:")
for clause in result.clauses:
    print(f"- {clause.clause_type}: {clause.text[:100]}...")
    if clause.is_deviation:
        print(f"  ⚠️  DEVIATION: {clause.deviation_notes}")

# Get summary
summary = result.summary
print(f"\nRisk Areas: {len(summary['risk_areas'])}")
for risk in summary['risk_areas']:
    print(f"- [{risk['risk_level']}] {risk['description']}")
```

#### Option C: Use REST API
1. Start the server:
```bash
python api.py
```

2. Analyze a contract:
```bash
curl -X POST http://localhost:5000/api/analyze \
  -F "file=@your_contract.pdf" \
  | jq '.'
```

## Common Tasks

### Extract Only Termination Clauses
```python
result = analyzer.analyze(text, doc_id, pages)
termination_clauses = [c for c in result.clauses if c.clause_type == 'termination']
```

### Find High-Risk Deviations
```python
high_risk = [c for c in result.clauses 
             if c.is_deviation and 
             any(term in c.deviation_notes.lower() 
                 for term in ['unlimited', 'no cap', 'immediate'])]
```

### Get Plain-English Summary
```python
summary = result.summary
print(summary['deviation_summary'])  # Text summary
print(summary['action_items'])       # Time-sensitive tasks
print(summary['risk_areas'])         # Areas needing review
```

### Evaluate Accuracy
```python
# Define ground truth
ground_truth = [
    Clause(clause_type='termination', text='...', page_number=1, ...)
]

# Evaluate
metrics = analyzer.evaluate(result.clauses, ground_truth)
print(f"F1 Score: {metrics['overall']['f1_score']:.3f}")
```

## Sample Output

```
Document: sample_msa.txt (35 pages)

Extracted Clauses:
✓ 5 Termination clauses (avg confidence: 0.89)
✓ 8 Indemnity clauses (avg confidence: 0.91)
✓ 6 SLA clauses (avg confidence: 0.87)

⚠️  Deviations Found: 3

Risk Areas:
🔴 HIGH - Indemnity: Unlimited liability detected
🟡 MEDIUM - Termination: Non-standard notice period (15 days)
🟡 MEDIUM - SLA: Below standard uptime (99.5%)

Processing Time: 3.2 seconds
Overall F1 Score: 0.92 ✓ (Target: 0.90)
```

## Troubleshooting

### Import Error
```
ModuleNotFoundError: No module named 'numpy'
```
**Solution:** Install dependencies
```bash
pip install numpy pandas scikit-learn
```

### PDF Extraction Issues
```
Error: Cannot extract text from PDF
```
**Solution:** Install PDF libraries
```bash
pip install PyPDF2 pdfplumber
```

### API Connection Error
```
Error: Connection refused at localhost:5000
```
**Solution:** Start the API server
```bash
python api.py
```

## Next Steps

1. **Customize Templates**: Edit `DeviationDetector` for your organization's standards
2. **Add Clause Types**: Extend `ClauseExtractor.clause_patterns` 
3. **Improve Accuracy**: Add training data and ML models
4. **Scale Up**: Deploy API to production server

## Resources

- Full Documentation: [README.md](README.md)
- API Reference: See `api.py` docstrings
- Test Examples: `test_analyzer.py`
- Sample Contract: `templates/sample_msa.txt`

---

**Need Help?** 
- Check the main README.md
- Review test_analyzer.py for examples
- Open an issue on GitHub
