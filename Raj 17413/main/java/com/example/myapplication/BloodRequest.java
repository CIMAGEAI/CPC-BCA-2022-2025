package com.example.myapplication;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.text.TextUtils;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

/**
 * BloodRequest.java
 * This activity allows users to submit a blood request by providing their name, phone,
 * desired blood group, city, and reason for the request.
 * The request is then stored in the local SQLite database.
 */
public class BloodRequest extends AppCompatActivity {

    private EditText etName, etPhone, etBloodGroup, etCity, etReason;
    private Button btnSubmitRequest;
    private UserDatabaseHelper dbHelper;

    @SuppressLint("MissingInflatedId")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_blood_request);



        // Initialize UI elements
        etName = findViewById(R.id.etName);
        etPhone = findViewById(R.id.etPhone);
        etBloodGroup = findViewById(R.id.etBloodGroup);
        etCity = findViewById(R.id.etCity);
        etReason = findViewById(R.id.etReason);
        btnSubmitRequest = findViewById(R.id.btnSubmitRequest);

        // Initialize database helper
        dbHelper = new UserDatabaseHelper(this);

        // Set click listener for the submit request button
        btnSubmitRequest.setOnClickListener(v -> submitBloodRequest());
    }

    /**
     * Handles the submission of a blood request.
     * Validates input fields and inserts the request into the database.
     */
    private void submitBloodRequest() {
        String name = etName.getText().toString().trim();
        String phone = etPhone.getText().toString().trim();
        String bloodGroup = etBloodGroup.getText().toString().trim();
        String city = etCity.getText().toString().trim();
        String reason = etReason.getText().toString().trim();

        // Input validation
        if (TextUtils.isEmpty(name)) {
            etName.setError("Name is required");
            etName.requestFocus();
            return;
        }

        if (TextUtils.isEmpty(phone) || !phone.matches("^\\d{10}$")) {
            etPhone.setError("Enter a valid 10-digit phone number");
            etPhone.requestFocus();
            return;
        }

        if (TextUtils.isEmpty(bloodGroup)) {
            etBloodGroup.setError("Blood Group is required (e.g., A+, O-)");
            etBloodGroup.requestFocus();
            return;
        }

        if (TextUtils.isEmpty(city)) {
            etCity.setError("City is required");
            etCity.requestFocus();
            return;
        }

        if (TextUtils.isEmpty(reason)) {
            etReason.setError("Reason for request is required");
            etReason.requestFocus();
            return;
        }

        // Insert the blood request into the database
        boolean inserted = dbHelper.insertBloodRequest(name, phone, bloodGroup, city, reason);

        if (inserted) {
            Toast.makeText(this, "Blood request submitted successfully!", Toast.LENGTH_SHORT).show();
            // Optionally clear fields or navigate back
            finish();
        } else {
            Toast.makeText(this, "Failed to submit blood request. Please try again.", Toast.LENGTH_SHORT).show();
        }
    }
}
