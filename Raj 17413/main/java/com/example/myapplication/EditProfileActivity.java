package com.example.myapplication;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Patterns;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.ArrayAdapter;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

public class EditProfileActivity extends AppCompatActivity {

    EditText editTextEmail, editTextPhone, editTextCity;
    Spinner spinnerBloodGroup;
    Button btnUpdate, btnLogout;
    UserDatabaseHelper dbHelper;
    String loggedInPhone;
    String originalBloodGroup; // 👈 Store original blood group

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_edit_profile);

        // Bind UI
        editTextEmail = findViewById(R.id.editTextEmail);
        editTextPhone = findViewById(R.id.editTextPhone);
        editTextCity = findViewById(R.id.editTextCity);
        spinnerBloodGroup = findViewById(R.id.spinnerBloodGroup);
        btnUpdate = findViewById(R.id.btnUpdate);
        btnLogout = findViewById(R.id.btnLogout);

        dbHelper = new UserDatabaseHelper(this);

        SharedPreferences preferences = getSharedPreferences("user_session", MODE_PRIVATE);
        loggedInPhone = preferences.getString("user_phone", null);

        if (loggedInPhone == null) {
            Toast.makeText(this, "User not logged in", Toast.LENGTH_SHORT).show();
            finish();
            return;
        }

        // Spinner setup
        String[] bloodGroups = {"A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"};
        ArrayAdapter<String> adapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_item, bloodGroups);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinnerBloodGroup.setAdapter(adapter);
        spinnerBloodGroup.setEnabled(false);      // 🔒 Disable spinner
        spinnerBloodGroup.setClickable(false);    // 🔒 Disable interaction

        // Populate fields
        UserModel user = dbHelper.getUserByPhone(loggedInPhone);
        if (user != null) {
            editTextEmail.setText(user.getEmail());
            editTextPhone.setText(user.getPhone());
            editTextCity.setText(user.getCity());

            originalBloodGroup = user.getBloodGroup(); // 🔒 Store original group

            for (int i = 0; i < bloodGroups.length; i++) {
                if (bloodGroups[i].equals(originalBloodGroup)) {
                    spinnerBloodGroup.setSelection(i);
                    break;
                }
            }
        }

        // ✅ Update profile
        btnUpdate.setOnClickListener(v -> {
            String email = editTextEmail.getText().toString().trim();
            String phone = editTextPhone.getText().toString().trim();
            String city = editTextCity.getText().toString().trim();

            if (!Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
                editTextEmail.setError("Invalid email");
                editTextEmail.requestFocus();
                return;
            }

            if (TextUtils.isEmpty(phone) || !phone.matches("^\\d{10}$")) {
                editTextPhone.setError("Enter valid 10-digit phone number");
                editTextPhone.requestFocus();
                return;
            }

            if (TextUtils.isEmpty(city)) {
                editTextCity.setError("City is required");
                editTextCity.requestFocus();
                return;
            }

            // Blood group is fixed, so we always pass originalBloodGroup
            boolean updated = dbHelper.updateUserProfile(loggedInPhone, email, phone, originalBloodGroup, city);
            if (updated) {
                Toast.makeText(EditProfileActivity.this, "Profile updated successfully", Toast.LENGTH_SHORT).show();
                finish();
            } else {
                Toast.makeText(EditProfileActivity.this, "Failed to update profile", Toast.LENGTH_SHORT).show();
            }
        });

        // ✅ Logout logic
        btnLogout.setOnClickListener(v -> {
            SharedPreferences.Editor editor = preferences.edit();
            editor.clear();
            editor.apply();

            Toast.makeText(this, "Logged out successfully", Toast.LENGTH_SHORT).show();
            startActivity(new Intent(this, LoginActivity.class));
            finish(); // prevent returning to profile
        });
    }
}
