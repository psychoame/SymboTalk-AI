"""
Document Processing Utilities
Handles PDF, DOCX, and text file parsing for contract analysis
"""

import os
from typing import Tuple, Optional
from dataclasses import dataclass


@dataclass
class DocumentMetadata:
    """Metadata about processed document"""
    filename: str
    file_type: str
    total_pages: int
    file_size: int
    word_count: int


class DocumentProcessor:
    """Process various document formats for contract analysis"""
    
    def __init__(self, max_pages: int = 80):
        self.max_pages = max_pages
        self.supported_formats = ['.pdf', '.docx', '.txt']
    
    def process(self, file_path: str) -> Tuple[str, DocumentMetadata]:
        """
        Process document and extract text
        
        Args:
            file_path: Path to document file
            
        Returns:
            Tuple of (extracted_text, metadata)
        """
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")
        
        file_ext = os.path.splitext(file_path)[1].lower()
        
        if file_ext not in self.supported_formats:
            raise ValueError(
                f"Unsupported file format: {file_ext}. "
                f"Supported formats: {', '.join(self.supported_formats)}"
            )
        
        # Extract text based on file type
        if file_ext == '.pdf':
            text, metadata = self._process_pdf(file_path)
        elif file_ext == '.docx':
            text, metadata = self._process_docx(file_path)
        else:  # .txt
            text, metadata = self._process_txt(file_path)
        
        # Validate page limit
        if metadata.total_pages > self.max_pages:
            raise ValueError(
                f"Document exceeds maximum page limit of {self.max_pages} pages. "
                f"Document has {metadata.total_pages} pages."
            )
        
        return text, metadata
    
    def _process_pdf(self, file_path: str) -> Tuple[str, DocumentMetadata]:
        """Extract text from PDF file"""
        try:
            import PyPDF2
            import pdfplumber
        except ImportError:
            raise ImportError(
                "PDF processing requires PyPDF2 and pdfplumber. "
                "Install with: pip install PyPDF2 pdfplumber"
            )
        
        text_parts = []
        total_pages = 0
        
        # Try pdfplumber first (better text extraction)
        try:
            with pdfplumber.open(file_path) as pdf:
                total_pages = len(pdf.pages)
                
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text_parts.append(page_text)
                        text_parts.append('\n\n')  # Page separator
        except Exception as e:
            # Fallback to PyPDF2
            print(f"pdfplumber failed, using PyPDF2: {e}")
            
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                total_pages = len(pdf_reader.pages)
                
                for page in pdf_reader.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text_parts.append(page_text)
                        text_parts.append('\n\n')
        
        full_text = ''.join(text_parts)
        
        metadata = DocumentMetadata(
            filename=os.path.basename(file_path),
            file_type='pdf',
            total_pages=total_pages,
            file_size=os.path.getsize(file_path),
            word_count=len(full_text.split())
        )
        
        return full_text, metadata
    
    def _process_docx(self, file_path: str) -> Tuple[str, DocumentMetadata]:
        """Extract text from DOCX file"""
        try:
            from docx import Document
        except ImportError:
            raise ImportError(
                "DOCX processing requires python-docx. "
                "Install with: pip install python-docx"
            )
        
        doc = Document(file_path)
        
        # Extract text from all paragraphs
        text_parts = []
        for paragraph in doc.paragraphs:
            if paragraph.text.strip():
                text_parts.append(paragraph.text)
                text_parts.append('\n\n')
        
        # Extract text from tables
        for table in doc.tables:
            for row in table.rows:
                row_text = ' | '.join(cell.text for cell in row.cells)
                if row_text.strip():
                    text_parts.append(row_text)
                    text_parts.append('\n')
        
        full_text = ''.join(text_parts)
        
        # Estimate pages (approximation: 500 words per page)
        word_count = len(full_text.split())
        estimated_pages = max(1, word_count // 500)
        
        metadata = DocumentMetadata(
            filename=os.path.basename(file_path),
            file_type='docx',
            total_pages=estimated_pages,
            file_size=os.path.getsize(file_path),
            word_count=word_count
        )
        
        return full_text, metadata
    
    def _process_txt(self, file_path: str) -> Tuple[str, DocumentMetadata]:
        """Extract text from plain text file"""
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as file:
            full_text = file.read()
        
        # Estimate pages (approximation: 500 words per page)
        word_count = len(full_text.split())
        estimated_pages = max(1, word_count // 500)
        
        metadata = DocumentMetadata(
            filename=os.path.basename(file_path),
            file_type='txt',
            total_pages=estimated_pages,
            file_size=os.path.getsize(file_path),
            word_count=word_count
        )
        
        return full_text, metadata
    
    def validate_document(self, file_path: str) -> Tuple[bool, str]:
        """
        Validate if document can be processed
        
        Returns:
            Tuple of (is_valid, error_message)
        """
        # Check file exists
        if not os.path.exists(file_path):
            return False, f"File not found: {file_path}"
        
        # Check file extension
        file_ext = os.path.splitext(file_path)[1].lower()
        if file_ext not in self.supported_formats:
            return False, f"Unsupported file format: {file_ext}"
        
        # Check file size (max 50MB)
        max_size = 50 * 1024 * 1024  # 50MB
        if os.path.getsize(file_path) > max_size:
            return False, f"File too large (max 50MB)"
        
        # Check if file is readable
        try:
            with open(file_path, 'rb') as f:
                f.read(1)
        except Exception as e:
            return False, f"Cannot read file: {str(e)}"
        
        return True, ""


class TextPreprocessor:
    """Preprocess and clean contract text for analysis"""
    
    @staticmethod
    def clean_text(text: str) -> str:
        """Clean and normalize contract text"""
        import re
        
        # Remove excessive whitespace
        text = re.sub(r'\s+', ' ', text)
        
        # Normalize paragraph breaks
        text = re.sub(r'\n\s*\n', '\n\n', text)
        
        # Remove page numbers (common patterns)
        text = re.sub(r'Page\s+\d+\s+of\s+\d+', '', text, flags=re.IGNORECASE)
        text = re.sub(r'^\s*\d+\s*$', '', text, flags=re.MULTILINE)
        
        # Remove headers/footers (repeated text at start/end of pages)
        # This is a simplified approach
        text = re.sub(r'(?:CONFIDENTIAL|PROPRIETARY)(?:\s+AND\s+PROPRIETARY)?(?:\s+INFORMATION)?', 
                     '', text, flags=re.IGNORECASE)
        
        # Normalize quotes
        text = text.replace('"', '"').replace('"', '"')
        text = text.replace(''', "'").replace(''', "'")
        
        # Remove zero-width characters
        text = re.sub(r'[\u200b-\u200d\ufeff]', '', text)
        
        return text.strip()
    
    @staticmethod
    def extract_sections(text: str) -> dict:
        """Extract document sections if they exist"""
        import re
        
        sections = {}
        
        # Common section patterns (readable format)
        article_pattern = r'(?:^|\n)(?:ARTICLE|SECTION|CLAUSE)\s+([IVXLCDM\d]+)[:\.]?\s+([^\n]+)'
        numbered_pattern = r'(?:^|\n)(\d+\.(?:\d+\.?)*)\s+([^\n]+)'
        
        section_patterns = [
            article_pattern,
            numbered_pattern,
        ]
        
        for pattern in section_patterns:
            matches = re.finditer(pattern, text, re.MULTILINE | re.IGNORECASE)
            for match in matches:
                section_num = match.group(1)
                section_title = match.group(2).strip()
                sections[section_num] = section_title
        
        return sections
