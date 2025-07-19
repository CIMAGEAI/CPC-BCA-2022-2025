package com.example.myapplication;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import java.util.List;

/**
 * BloodRequestAdapter.java
 * This adapter is used to display a list of BloodRequestModel objects in a RecyclerView.
 * It inflates the item layout and binds data to the TextViews.
 */
public class BloodRequestAdapter extends RecyclerView.Adapter<BloodRequestAdapter.BloodRequestViewHolder> {

    private List<BloodRequestModel> requestList;

    public BloodRequestAdapter(List<BloodRequestModel> requestList) {
        this.requestList = requestList;
    }

    /**
     * Updates the data in the adapter and notifies the RecyclerView to refresh.
     * @param newRequestList The new list of BloodRequestModel objects to display.
     */
    public void updateData(List<BloodRequestModel> newRequestList) {
        this.requestList.clear();
        this.requestList.addAll(newRequestList);
        notifyDataSetChanged();
    }

    @NonNull
    @Override
    public BloodRequestViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        // Inflate the layout for a single blood request item.
        // You'll need to create a layout file named 'item_blood_request.xml' for this.
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.activity_item_blood_request, parent, false);
        return new BloodRequestViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull BloodRequestViewHolder holder, int position) {
        BloodRequestModel request = requestList.get(position);
        holder.nameTextView.setText(request.getName());
        holder.phoneTextView.setText("Phone: " + request.getPhone());
        holder.bloodGroupTextView.setText("Blood Group: " + request.getBloodGroup());
        holder.cityTextView.setText("City: " + request.getCity());
        holder.reasonTextView.setText("Reason: " + request.getReason());
    }

    @Override
    public int getItemCount() {
        return requestList.size();
    }

    /**
     * ViewHolder class to hold references to the views for each blood request item.
     */
    public static class BloodRequestViewHolder extends RecyclerView.ViewHolder {
        TextView nameTextView;
        TextView phoneTextView;
        TextView bloodGroupTextView;
        TextView cityTextView;
        TextView reasonTextView;

        public BloodRequestViewHolder(@NonNull View itemView) {
            super(itemView);
            // Bind the TextViews from your item_blood_request.xml layout
            nameTextView = itemView.findViewById(R.id.tvRequestName);
            phoneTextView = itemView.findViewById(R.id.tvRequestPhone);
            bloodGroupTextView = itemView.findViewById(R.id.tvRequestBloodGroup);
            cityTextView = itemView.findViewById(R.id.tvRequestCity);
            reasonTextView = itemView.findViewById(R.id.tvRequestReason);
        }
    }
}
