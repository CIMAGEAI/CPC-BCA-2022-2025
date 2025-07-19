package com.example.myapplication; // <--- ENSURE THIS LINE IS EXACTLY AS SHOWN

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import com.example.myapplication.UserModel;

import java.util.List;

/**
 * DonorAdapter.java
 * This adapter is used to display a list of donor (UserModel) objects in a RecyclerView.
 * It inflates the item layout and binds data to the TextViews.
 */
public class DonorAdapter extends RecyclerView.Adapter<DonorAdapter.DonorViewHolder> {

    private List<UserModel> donorList;

    public DonorAdapter(List<UserModel> donorList) {
        this.donorList = donorList;
    }

    /**
     * Updates the data in the adapter and notifies the RecyclerView to refresh.
     * @param newDonorList The new list of UserModel objects to display.
     */
    public void updateData(List<UserModel> newDonorList) {
        this.donorList.clear();
        this.donorList.addAll(newDonorList);
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public DonorViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        // Inflate the layout for a single donor item.
        // You'll need to create a layout file named 'item_donor.xml' for this.
        // IMPORTANT: Ensure 'item_donor' matches your XML layout file name.
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.activity_item_donor, parent, false);
        return new DonorViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull DonorViewHolder holder, int position) {
        UserModel donor = donorList.get(position);
        holder.nameTextView.setText(donor.getEmail()); // Assuming email is used as name for display
        holder.phoneTextView.setText(donor.getPhone());
        holder.bloodGroupTextView.setText(donor.getBloodGroup());
        holder.cityTextView.setText(donor.getCity());
    }

    @Override
    public int getItemCount() {
        return donorList.size();
    }

    /**
     * ViewHolder class to hold references to the views for each donor item.
     */
    public static class DonorViewHolder extends RecyclerView.ViewHolder {
        TextView nameTextView;
        TextView phoneTextView;
        TextView bloodGroupTextView;
        TextView cityTextView;

        public DonorViewHolder(@NonNull View itemView) {
            super(itemView);
            // Bind the TextViews from your item_donor.xml layout
            nameTextView = itemView.findViewById(R.id.tvDonorName);
            phoneTextView = itemView.findViewById(R.id.tvDonorPhone);
            bloodGroupTextView = itemView.findViewById(R.id.tvDonorBloodGroup);
            cityTextView = itemView.findViewById(R.id.tvDonorCity);
        }
    }
}
