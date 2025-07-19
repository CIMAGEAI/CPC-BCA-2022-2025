package com.example.myapplication;

import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.Spinner;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;
import java.util.List;

/**
 * RequestListActivity.java
 * This activity displays a list of blood requests. Users can filter requests
 * by a specific blood group using a spinner, or view requests matching their
 * own blood type, or view all requests.
 */
public class RequestList extends AppCompatActivity {

    private Spinner spinnerFilterBloodGroup;
    private Button btnShowMyBloodTypeRequests, btnShowAllRequests;
    private RecyclerView recyclerViewBloodRequests;
    private BloodRequestAdapter requestAdapter;
    private UserDatabaseHelper dbHelper;
    private String currentUserBloodGroup;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_request_list);

        // Apply window insets to handle system bars
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.textTitle), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        // Initialize UI elements
        spinnerFilterBloodGroup = findViewById(R.id.spinnerFilterBloodGroup);
        btnShowMyBloodTypeRequests = findViewById(R.id.btnShowMyBloodTypeRequests);
        btnShowAllRequests = findViewById(R.id.btnShowAllRequests);
        recyclerViewBloodRequests = findViewById(R.id.recyclerViewBloodRequests);

        // Initialize database helper
        dbHelper = new UserDatabaseHelper(this);

        // Get current user's blood group from SharedPreferences (or fetch from DB if not stored)
        SharedPreferences preferences = getSharedPreferences("user_session", MODE_PRIVATE);
        String loggedInPhone = preferences.getString("user_phone", null);
        if (loggedInPhone != null) {
            currentUserBloodGroup = dbHelper.getBloodGroupByPhone(loggedInPhone);
        } else {
            Toast.makeText(this, "User not logged in. Cannot fetch personal blood type.", Toast.LENGTH_SHORT).show();
            currentUserBloodGroup = null; // No logged in user
        }


        // Setup RecyclerView
        recyclerViewBloodRequests.setLayoutManager(new LinearLayoutManager(this));
        requestAdapter = new BloodRequestAdapter(new ArrayList<>());
        recyclerViewBloodRequests.setAdapter(requestAdapter);

        // Setup Blood Group Spinner
        String[] bloodGroups = {"All Blood Groups", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"};
        ArrayAdapter<String> spinnerAdapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_item, bloodGroups);
        spinnerAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinnerFilterBloodGroup.setAdapter(spinnerAdapter);

        // Load all requests initially
        loadBloodRequests(null); // Load all requests by default

        // Spinner item selection listener
        spinnerFilterBloodGroup.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                String selectedBloodGroup = parent.getItemAtPosition(position).toString();
                if (selectedBloodGroup.equals("All Blood Groups")) {
                    loadBloodRequests(null); // Load all requests
                } else {
                    loadBloodRequests(selectedBloodGroup); // Load requests for selected blood group
                }
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {
                // Do nothing
            }
        });

        // Button to show requests for current user's blood type
        btnShowMyBloodTypeRequests.setOnClickListener(v -> {
            if (currentUserBloodGroup != null) {
                loadBloodRequests(currentUserBloodGroup);
                // Optionally set spinner selection to current user's blood group
                for (int i = 0; i < bloodGroups.length; i++) {
                    if (bloodGroups[i].equals(currentUserBloodGroup)) {
                        spinnerFilterBloodGroup.setSelection(i);
                        break;
                    }
                }
            } else {
                Toast.makeText(this, "Please log in to view requests for your blood type.", Toast.LENGTH_SHORT).show();
            }
        });

        // Button to show all requests
        btnShowAllRequests.setOnClickListener(v -> {
            loadBloodRequests(null);
            spinnerFilterBloodGroup.setSelection(0); // Set spinner to "All Blood Groups"
        });
    }

    /**
     * Loads blood requests from the database and updates the RecyclerView.
     * If bloodGroup is null, all requests are loaded. Otherwise, requests for the
     * specified blood group are loaded.
     * @param bloodGroup The blood group to filter by, or null for all requests.
     */
    private void loadBloodRequests(String bloodGroup) {
        List<BloodRequestModel> requests;
        if (bloodGroup == null || bloodGroup.equals("All Blood Groups")) {
            requests = dbHelper.getAllRequests();
        } else {
            requests = dbHelper.getRequestsByBloodGroup(bloodGroup);
        }

        if (requests.isEmpty()) {
            Toast.makeText(this, "No blood requests found.", Toast.LENGTH_SHORT).show();
        }
        requestAdapter.updateData(requests);
    }
}
