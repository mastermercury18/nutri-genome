# Genomic File Upload Integration

This document describes the changes made to enable reading from user-uploaded genomic files instead of the hardcoded `liver.txt` file.

## Changes Made

### 1. Frontend Changes

**File: `src/lib/api.ts`**
- Updated `MealPlanRequest` interface to include `genomicFile: File`
- Modified `generateMealPlan` function to send the file as part of FormData

**File: `src/pages/Dashboard.tsx`**
- Updated the API call to pass the uploaded `genomicFile` to the backend

### 2. Backend Changes

**File: `backend/app.py`**
- Modified `/api/meal_plan_submit` endpoint to accept file uploads
- Added file handling logic to save uploaded files to temporary location
- Pass the file path to the meal plan generation function
- Added cleanup of temporary files

**File: `backend/meal.py`**
- Updated `meal_plan` function to accept `GenomicFilePath` parameter
- Modified to process uploaded genomic files instead of hardcoded `liver.txt`
- Added fallback to default file if no uploaded file is provided

**File: `backend/qnn_processor.py`** (New)
- Extracted QNN logic from the Jupyter notebook
- Contains functions for processing genomic data with quantum neural networks
- Includes the full pipeline: SNP extraction, circuit building, optimization, and classification

**File: `backend/requirements.txt`**
- Added dependencies for QNN processing:
  - `qiskit==2.1.1`
  - `qiskit-aer==0.17.1`
  - `torch==2.1.0`
  - `numpy==2.0.2`
  - `scipy==1.15.3`
  - `pandas==2.1.0`

## How It Works

1. **User Upload**: User uploads a genomic file through the Dashboard interface
2. **File Transfer**: Frontend sends the file along with health form data to the backend
3. **File Processing**: Backend saves the uploaded file to a temporary location
4. **QNN Analysis**: The genomic file is processed using quantum neural networks to determine liver cirrhosis risk
5. **Meal Plan Generation**: The risk assessment is combined with other health data to generate a personalized meal plan
6. **Cleanup**: Temporary files are automatically cleaned up after processing

## File Format

The uploaded genomic file should be in the same format as `liver.txt`:
```
rs_id	chr	pos	ref	alt	effect_weight
rs123456	1	1000	A	G	0.1
rs234567	2	2000	C	T	0.2
...
```

## Testing

Run the test script to verify the functionality:
```bash
cd backend
python test_file_upload.py
```

## Installation

Install the new dependencies:
```bash
cd backend
pip install -r requirements.txt
```

## Notes

- The QNN processing is computationally intensive and may take some time
- If QNN dependencies are not available, the system falls back to simple SNP analysis
- Temporary files are automatically cleaned up to prevent disk space issues
- The system maintains backward compatibility with the existing `liver.txt` file as a fallback 