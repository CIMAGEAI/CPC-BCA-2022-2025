package com.example.myapplication;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;
import android.content.SharedPreferences;

import androidx.appcompat.app.AppCompatActivity;


public class LoginActivity extends AppCompatActivity {

    private EditText editPhone, editPassword;
    private Button btnLogin;
    private UserDatabaseHelper dbHelper;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        SharedPreferences preferences = getSharedPreferences("user_session", MODE_PRIVATE);
        String savedPhone = preferences.getString("user_phone", null);

        if (savedPhone != null) {
            startActivity(new Intent(this, Home.class));
            finish();
            return;
        }

        setContentView(R.layout.activity_login);

        editPhone = findViewById(R.id.edit_lname);
        editPassword = findViewById(R.id.editTextPassword);
        btnLogin = findViewById(R.id.login);

        dbHelper = new UserDatabaseHelper(this);


        btnLogin.setOnClickListener(v -> {
            String phone = editPhone.getText().toString().trim();
            String password = editPassword.getText().toString().trim();


            if (TextUtils.isEmpty(phone)) {
                editPhone.setError("Phone number is required");
                editPhone.requestFocus();
                return;
            }

            if (!phone.matches("^\\d{10}$")) {
                editPhone.setError("Enter a valid 10-digit phone number");
                editPhone.requestFocus();
                return;
            }

            if (TextUtils.isEmpty(password)) {
                editPassword.setError("Password is required");
                editPassword.requestFocus();
                return;
            }

            // ✅ Check credentials
            if (dbHelper.checkUserCredentials(phone, password)) {
                Toast.makeText(this, "Login successful", Toast.LENGTH_SHORT).show();

                // ✅ Save session
                SharedPreferences.Editor editor = preferences.edit();
                editor.putString("user_phone", phone);
                editor.apply();

                // ✅ Redirect to Home
                startActivity(new Intent(this, Home.class));
                finish();
            } else {
                Toast.makeText(this, "Invalid phone number or password", Toast.LENGTH_SHORT).show();
            }
        });

        // ✅ Signup button action
        findViewById(R.id.btn_signup).setOnClickListener(v -> {
            startActivity(new Intent(this, Signup.class));
        });
    }
}
