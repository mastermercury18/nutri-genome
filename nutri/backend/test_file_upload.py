#!/usr/bin/env python3
"""
Test script to verify file upload and genomic processing functionality
"""

import os
import tempfile
from meal import meal_plan

def test_genomic_file_processing():
    """Test the genomic file processing with a sample file"""
    
    # Create a sample genomic file (similar to liver.txt format)
    sample_data = """rs_id	chr	pos	ref	alt	effect_weight
rs123456	1	1000	A	G	0.1
rs234567	2	2000	C	T	0.2
rs345678	3	3000	G	A	0.15
rs456789	4	4000	T	C	0.25
rs567890	5	5000	A	T	0.3
rs678901	6	6000	C	G	0.1
rs789012	7	7000	G	C	0.2
rs890123	8	8000	T	A	0.15
rs901234	9	9000	A	G	0.25
rs012345	10	10000	C	T	0.3
rs123456	11	11000	G	A	0.1
rs234567	12	12000	T	C	0.2"""
    
    # Create temporary file
    with tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.txt') as f:
        f.write(sample_data)
        temp_file_path = f.name
    
    try:
        # Test the meal plan function with the genomic file
        form_data = {
            "Diabetes": "medium",
            "Lactose": "mild", 
            "Calcium": "adequate",
            "Ethnicity": "caucasian",
            "Special Requests": "vegetarian",
            "GenomicFilePath": temp_file_path
        }
        
        print("Testing meal plan generation with uploaded genomic file...")
        result = meal_plan(form_data)
        
        print("Result:", result)
        
        if result and 'output' in result:
            print("✅ Success! Meal plan generated successfully.")
            print("Sample output:", result['output'][:200] + "..." if len(result['output']) > 200 else result['output'])
        else:
            print("❌ Error: No output generated")
            
    except Exception as e:
        print(f"❌ Error during testing: {e}")
        
    finally:
        # Clean up temporary file
        try:
            os.unlink(temp_file_path)
        except:
            pass

if __name__ == "__main__":
    test_genomic_file_processing() 