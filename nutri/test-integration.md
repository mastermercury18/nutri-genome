# Integration Test Guide

## Prerequisites
1. Frontend running on http://localhost:5173
2. Backend running on http://localhost:8000
3. OpenAI API key configured

## Test Steps

### 1. Frontend Navigation
- [ ] Open http://localhost:5173
- [ ] Navigate to Dashboard page
- [ ] Verify form fields are present:
  - Diabetes risk dropdown
  - Lactose intolerance dropdown
  - Calcium intake dropdown
  - Ethnicity dropdown
  - Special requests textarea
  - File upload area

### 2. File Upload
- [ ] Upload a .txt file (any text file for testing)
- [ ] Verify success message appears
- [ ] Verify file name is displayed

### 3. Form Submission
- [ ] Fill in all required fields:
  - Diabetes: "High"
  - Lactose: "Yes"
  - Calcium: "Severely Low"
  - Ethnicity: "Indian"
  - Special: "No nuts"
- [ ] Click "Generate Personalized Meal Plan"
- [ ] Verify loading state appears
- [ ] Verify success message
- [ ] Verify navigation to MealPlan page

### 4. Meal Plan Display
- [ ] Verify meal plan is displayed with:
  - Breakfast, lunch, dinner cards
  - Nutritional information
  - Ingredients and benefits
  - Calorie totals
- [ ] Verify health insights are shown
- [ ] Test "Export Plan" button
- [ ] Test "Regenerate" button

### 5. Backend API Test
```bash
# Test meal plan generation
curl -X POST http://localhost:8000/api/meal_plan_submit \
  -F "diabetes=high" \
  -F "lactose=yes" \
  -F "calcium=severely_low" \
  -F "ethnicity=indian" \
  -F "special=no nuts"

# Expected response: JSON with "output" field containing meal plan
```

### 6. Error Handling
- [ ] Test with missing required fields
- [ ] Test with invalid file format
- [ ] Test with backend server down
- [ ] Verify appropriate error messages

## Expected Behavior

1. **Dashboard**: Clean form with proper validation
2. **API Call**: Successful communication with backend
3. **Meal Plan**: Structured display of AI-generated meals
4. **Navigation**: Smooth flow between pages
5. **Error Handling**: User-friendly error messages
6. **Export**: Downloadable meal plan file
7. **Regenerate**: New meal plan generation

## Troubleshooting

### Frontend Issues
- Check browser console for errors
- Verify all dependencies are installed
- Check TypeScript compilation

### Backend Issues
- Check Flask server logs
- Verify OpenAI API key
- Check CORS configuration
- Verify all Python dependencies

### Integration Issues
- Check API_BASE_URL in src/lib/api.ts
- Verify CORS settings in backend/app.py
- Check network requests in browser dev tools 