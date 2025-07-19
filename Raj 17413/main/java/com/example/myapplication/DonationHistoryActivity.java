package com.example.myapplication;

import android.os.Bundle;
import android.view.View;
import android.widget.TextView;
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
 * DonationHistoryActivity.java
 * This activity displays a list of the user's past blood donations.
 * Currently, it shows a placeholder message as the UserDatabaseHelper
 * does not have a dedicated table for donation history.
 * This can be extended in the future to fetch actual donation records.
 */
public class DonationHistoryActivity extends AppCompatActivity {

    private RecyclerView recyclerViewDonationHistory;
    private DonationHistoryAdapter donationHistoryAdapter;
    private TextView tvNoDonations;
    // UserDatabaseHelper dbHelper; // Uncomment and use if you add donation history to DB

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_donation_history);

        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.recyclerViewDonationHistory), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        recyclerViewDonationHistory = findViewById(R.id.recyclerViewDonationHistory);
        tvNoDonations = findViewById(R.id.tvNoDonations);
        // dbHelper = new UserDatabaseHelper(this); // Initialize if needed

        recyclerViewDonationHistory.setLayoutManager(new LinearLayoutManager(this));
        donationHistoryAdapter = new DonationHistoryAdapter(new ArrayList<>());
        recyclerViewDonationHistory.setAdapter(donationHistoryAdapter);

        loadDonationHistory();
    }

    /**
     * Loads donation history. Currently, it adds dummy data or shows a "no records" message.
     * In a real application, this would fetch data from the database.
     */
    private void loadDonationHistory() {
        List<DonationHistoryModel> donations = new ArrayList<>();
        // Example: Add dummy data for demonstration
        // donations.add(new DonationHistoryModel("2024-01-15", "A+", "City Hospital"));
        // donations.add(new DonationHistoryModel("2023-09-20", "A+", "Red Cross Center"));

        if (donations.isEmpty()) {
            tvNoDonations.setVisibility(View.VISIBLE);
            recyclerViewDonationHistory.setVisibility(View.GONE);
            Toast.makeText(this, "No donation history available.", Toast.LENGTH_LONG).show();
        } else {
            tvNoDonations.setVisibility(View.GONE);
            recyclerViewDonationHistory.setVisibility(View.VISIBLE);
            donationHistoryAdapter.updateData(donations);
        }
    }
}
