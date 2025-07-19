package com.example.myapplication;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Patterns;
import android.view.View;
import android.widget.*;

import androidx.appcompat.app.AppCompatActivity;

public class Signup extends AppCompatActivity {

    EditText editTextPhone, editTextEmail, editTextCity, editTextPassword;
    Spinner spinnerBloodGroup;
    Button btnRegister;
    TextView tvLoginLink;

    UserDatabaseHelper dbHelper;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_signup);

        dbHelper = new UserDatabaseHelper(this);

        editTextPhone = findViewById(R.id.editTextPhone);
        editTextEmail = findViewById(R.id.editTextEmail);
        editTextCity = findViewById(R.id.editTextCity);
        editTextPassword = findViewById(R.id.editTextPassword);
        spinnerBloodGroup = findViewById(R.id.spinnerBloodGroup);
        btnRegister = findViewById(R.id.btn_register);
        tvLoginLink = findViewById(R.id.tvLoginLink);

        ArrayAdapter<CharSequence> adapter = ArrayAdapter.createFromResource(this,
                R.array.blood_groups, android.R.layout.simple_spinner_item);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinnerBloodGroup.setAdapter(adapter);

        // Register button click
        btnRegister.setOnClickListener(v -> registerUser());

        // Redirect to login
        tvLoginLink.setOnClickListener(v -> {
            startActivity(new Intent(Signup.this, LoginActivity.class));
        });
    }

    private void registerUser() {
        String phone = editTextPhone.getText().toString().trim();
        String email = editTextEmail.getText().toString().trim();
        String city = editTextCity.getText().toString().trim();
        String password = editTextPassword.getText().toString().trim();
        String bloodGroup = spinnerBloodGroup.getSelectedItem().toString();

        if (TextUtils.isEmpty(phone) || phone.length() < 10) {
            editTextPhone.setError("Valid phone number required");
            return;
        }

        if (TextUtils.isEmpty(email) || !Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            editTextEmail.setError("Valid email required");
            return;
        }

        if (TextUtils.isEmpty(city)) {
            editTextCity.setError("City required");
            return;
        }

        if (TextUtils.isEmpty(password) || password.length() < 4) {
            editTextPassword.setError("Password must be at least 4 characters");
            return;
        }

        boolean inserted = dbHelper.insertUser(email, phone, password, city, bloodGroup);
        if (inserted) {
            Toast.makeText(this, "Registration Successful", Toast.LENGTH_SHORT).show();
            startActivity(new Intent(this, LoginActivity.class));
            finish();
        } else {
            Toast.makeText(this, "User already exists", Toast.LENGTH_SHORT).show();
        }
    }
}
