package com.example.myapplication;

import android.Manifest;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.cardview.widget.CardView;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.bumptech.glide.Glide;
import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationServices;





/**
 * Home.java
 * Main dashboard screen showing options to:
 * - Search Donor
 * - Request Blood
 * - View Donation History
 * - Nearby Blood Bank
 * - Blood Request List
 * - Edit Profile
 * Also updates user location if permission is granted.
 */
public class Home extends AppCompatActivity {

    private static final int LOCATION_PERMISSION_REQUEST = 100;

    // UI Elements
    private CardView cardSearchDonor, cardBloodRequest, cardDonationHistory, cardNearbyBloodBank, cardRequestlist;
    private ImageView ivProfile;
    private TextView tvWelcome;

    // Helpers
    private FusedLocationProviderClient fusedLocationClient;
    private UserDatabaseHelper dbHelper;
    private int userId;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_home);

        // Initialize database helper
        dbHelper = new UserDatabaseHelper(this);

        // Get user phone from session
        SharedPreferences prefs = getSharedPreferences("user_session", MODE_PRIVATE);
        String phone = prefs.getString("user_phone", null);

        // Check session validity
        if (phone != null) {
            userId = dbHelper.getUserIdByPhone(phone);
            tvWelcome = findViewById(R.id.tvWelcome);
            tvWelcome.setText("Welcome");
        } else {
            Toast.makeText(this, "Session expired. Please log in again.", Toast.LENGTH_LONG).show();
            startActivity(new Intent(Home.this, LoginActivity.class));
            finish();
            return;
        }

        // Profile image and click action
        ivProfile = findViewById(R.id.ivProfile);
        Glide.with(this)
                .load(R.drawable.profile)
                .circleCrop()
                .into(ivProfile);

        ivProfile.setOnClickListener(v -> startActivity(new Intent(Home.this,EditProfileActivity.class)));

        // Initialize location client
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this);
        requestLocationPermission();

        // Bind CardViews
        cardSearchDonor = findViewById(R.id.cardSearchDonor);
        cardBloodRequest = findViewById(R.id.cardBloodRequest);
        cardDonationHistory = findViewById(R.id.cardDonationHistory);
        cardNearbyBloodBank = findViewById(R.id.cardNearbyBloodBank);
        cardRequestlist = findViewById(R.id.cardRequestlist);

        // Set CardView click actions
        cardSearchDonor.setOnClickListener(v -> startActivity(new Intent(Home.this, SearchDoner.class)));
        cardBloodRequest.setOnClickListener(v -> startActivity(new Intent(Home.this, BloodRequest.class)));
        cardDonationHistory.setOnClickListener(v -> startActivity(new Intent(Home.this, DonationHistoryActivity.class)));
        cardNearbyBloodBank.setOnClickListener(v -> startActivity(new Intent(Home.this, NearbyBloodBankActivity.class)));
        cardRequestlist.setOnClickListener(v -> startActivity(new Intent(Home.this, RequestList.class)));
    }

    /**
     * Request location permission if not already granted.
     */
    private void requestLocationPermission() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION)
                != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this,
                    new String[]{Manifest.permission.ACCESS_FINE_LOCATION},
                    LOCATION_PERMISSION_REQUEST);
        } else {
            getUserLocation();
        }
    }

    /**
     * Get the user's last known location and update it in the database.
     */
    private void getUserLocation() {
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION)
                != PackageManager.PERMISSION_GRANTED &&
                ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION)
                        != PackageManager.PERMISSION_GRANTED) {
            return;
        }

        fusedLocationClient.getLastLocation().addOnSuccessListener(location -> {
            if (location != null) {
                double lat = location.getLatitude();
                double lng = location.getLongitude();
                String city = dbHelper.getCityByPhone(getUserPhone());
                dbHelper.updateUserLocation(userId, lat, lng, city);
                Toast.makeText(this, "Location saved!", Toast.LENGTH_SHORT).show();
            } else {
                Toast.makeText(this, "Unable to fetch location", Toast.LENGTH_SHORT).show();
            }
        });
    }

    /**
     * Get phone number of logged-in user from SharedPreferences.
     */
    private String getUserPhone() {
        SharedPreferences preferences = getSharedPreferences("user_session", MODE_PRIVATE);
        return preferences.getString("user_phone", null);
    }

    /**
     * Handle location permission result.
     */
    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions,
                                           @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == LOCATION_PERMISSION_REQUEST &&
                grantResults.length > 0 &&
                grantResults[0] == PackageManager.PERMISSION_GRANTED) {
            getUserLocation();
        } else {
            Toast.makeText(this, "Location permission denied", Toast.LENGTH_SHORT).show();
        }
    }
}
