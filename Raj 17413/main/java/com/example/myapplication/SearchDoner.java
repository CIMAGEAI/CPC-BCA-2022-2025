package com.example.myapplication;

import android.Manifest;
import android.content.pm.PackageManager;
import android.location.Address;
import android.location.Geocoder;
import android.location.Location;
import android.os.Bundle;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.Spinner;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationServices;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

public class SearchDoner extends AppCompatActivity {

    private static final int LOCATION_PERMISSION_REQUEST = 100;

    private Spinner spinnerBloodGroup;
    private EditText editTextCity;
    private ImageButton buttonUseLocation;
    private Button buttonSearch;
    private RecyclerView recyclerViewDonors;

    private FusedLocationProviderClient fusedLocationClient;

    private UserDatabaseHelper dbHelper;
    private DonorAdapter donorAdapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_search_doner);

        ViewCompat.setOnApplyWindowInsetsListener(findViewById(android.R.id.content), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        spinnerBloodGroup = findViewById(R.id.spinnerBloodGroup);
        editTextCity = findViewById(R.id.editTextCity);
        buttonUseLocation = findViewById(R.id.buttonUseLocation);
        buttonSearch = findViewById(R.id.buttonSearch);
        recyclerViewDonors = findViewById(R.id.recyclerViewDonors);

        dbHelper = new UserDatabaseHelper(this);

        recyclerViewDonors.setLayoutManager(new LinearLayoutManager(this));
        donorAdapter = new DonorAdapter(new ArrayList<>());
        recyclerViewDonors.setAdapter(donorAdapter);

        ArrayAdapter<CharSequence> adapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_item,
                new String[]{"A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"});
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinnerBloodGroup.setAdapter(adapter);

        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this);

        buttonUseLocation.setOnClickListener(v -> getCurrentLocation());
        buttonSearch.setOnClickListener(v -> {
            String selectedBloodGroup = spinnerBloodGroup.getSelectedItem().toString();
            String city = editTextCity.getText().toString().trim();
            if (city.isEmpty()) {
                Toast.makeText(this, "Please enter a city or use location button", Toast.LENGTH_SHORT).show();
                return;
            }
            searchDonors(city, selectedBloodGroup);
        });
    }

    private void getCurrentLocation() {
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.ACCESS_FINE_LOCATION}, LOCATION_PERMISSION_REQUEST);
            return;
        }
        fusedLocationClient.getLastLocation().addOnSuccessListener(this, location -> {
            if (location != null) {
                String cityName = getCityFromLocation(location);
                if (cityName != null) {
                    editTextCity.setText(cityName);
                } else {
                    Toast.makeText(this, "Unable to detect city", Toast.LENGTH_SHORT).show();
                }
            } else {
                Toast.makeText(this, "Location not found", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private String getCityFromLocation(Location location) {
        Geocoder geocoder = new Geocoder(this, Locale.getDefault());
        try {
            List<Address> addresses = geocoder.getFromLocation(location.getLatitude(), location.getLongitude(), 1);
            if (addresses != null && addresses.size() > 0) {
                return addresses.get(0).getLocality();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    private void searchDonors(String city, String bloodGroup) {
        List<UserModel> donors = dbHelper.getDonorsByCityAndBlood(city, bloodGroup);
        if (donors.isEmpty()) {
            Toast.makeText(this, "No donors found", Toast.LENGTH_SHORT).show();
        }
        donorAdapter.updateData(donors);
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions,
                                           @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == LOCATION_PERMISSION_REQUEST) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                getCurrentLocation();
            } else {
                Toast.makeText(this, "Location permission denied", Toast.LENGTH_SHORT).show();
            }
        }
    }
}
