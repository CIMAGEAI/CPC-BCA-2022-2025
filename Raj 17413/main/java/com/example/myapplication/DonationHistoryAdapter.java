package com.example.myapplication;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import java.util.List;

/**
 * DonationHistoryAdapter.java
 * This adapter is used to display a list of DonationHistoryModel objects in a RecyclerView.
 */
public class DonationHistoryAdapter extends RecyclerView.Adapter<DonationHistoryAdapter.DonationViewHolder> {

    private List<DonationHistoryModel> donationList;

    public DonationHistoryAdapter(List<DonationHistoryModel> donationList) {
        this.donationList = donationList;
    }

    public void updateData(List<DonationHistoryModel> newDonationList) {
        this.donationList.clear();
        this.donationList.addAll(newDonationList);
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public DonationViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        // You'll need to create a layout file named 'item_donation_history.xml' for this.
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.activity_item_donation_history, parent, false);
        return new DonationViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull DonationViewHolder holder, int position) {
        DonationHistoryModel donation = donationList.get(position);
        holder.dateTextView.setText("Date: " + donation.getDate());
        holder.bloodGroupTextView.setText("Blood Group: " + donation.getBloodGroup());
        holder.locationTextView.setText("Location: " + donation.getLocation());
    }

    @Override
    public int getItemCount() {
        return donationList.size();
    }

    public static class DonationViewHolder extends RecyclerView.ViewHolder {
        TextView dateTextView;
        TextView bloodGroupTextView;
        TextView locationTextView;

        public DonationViewHolder(@NonNull View itemView) {
            super(itemView);
            // Bind the TextViews from your item_donation_history.xml layout
            dateTextView = itemView.findViewById(R.id.tvDonationDate);
            bloodGroupTextView = itemView.findViewById(R.id.tvDonationBloodGroup);
            locationTextView = itemView.findViewById(R.id.tvDonationLocation);
        }
    }
}
