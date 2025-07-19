package com.example.myapplication;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.pm.PackageManager;
import android.location.Location;
import android.os.Bundle;
import android.widget.ProgressBar;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;
import java.util.List;

public class NearbyBloodBankActivity extends AppCompatActivity {

    private RecyclerView recyclerView;
    private ProgressBar progressBar;
    private List<BloodBankModel> bloodBankList;
    private BloodBankAdapter adapter;

    @SuppressLint("MissingPermission")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_nearby_blood_bank);

        recyclerView = findViewById(R.id.recyclerViewBloodBanks);
        progressBar = findViewById(R.id.progressBar);

        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        bloodBankList = new ArrayList<>();
        adapter = new BloodBankAdapter(bloodBankList);
        recyclerView.setAdapter(adapter);

        // For now, showing dummy data; later replace with Google Maps or Places API
        showDummyBloodBanks();
    }

    private void showDummyBloodBanks() {
        progressBar.setVisibility(ProgressBar.VISIBLE);

        bloodBankList.add(new BloodBankModel("Red Cross Blood Bank", "Patna, Bihar", "0621-2334455"));
        bloodBankList.add(new BloodBankModel("Lions Club Blood Bank", "Gandhi Maidan, Patna", "0621-2323322"));
        bloodBankList.add(new BloodBankModel("PMCH Blood Bank", "PMCH Campus, Patna", "0621-2456789"));
        bloodBankList.add(new BloodBankModel("IGIMS Blood Bank", "Sheikhpura, Patna", "0621-2456799"));

        adapter.notifyDataSetChanged();
        progressBar.setVisibility(ProgressBar.GONE);
    }
}
