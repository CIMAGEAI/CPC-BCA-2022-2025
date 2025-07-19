package com.example.myapplication;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

public class BloodBankAdapter extends RecyclerView.Adapter<BloodBankAdapter.BloodBankViewHolder> {

    private List<BloodBankModel> bloodBankList;

    public BloodBankAdapter(List<BloodBankModel> bloodBankList) {
        this.bloodBankList = bloodBankList;
    }

    @NonNull
    @Override
    public BloodBankViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_blood_bank, parent, false);
        return new BloodBankViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull BloodBankViewHolder holder, int position) {
        BloodBankModel bloodBank = bloodBankList.get(position);
        holder.textViewName.setText(bloodBank.getName());
        holder.textViewAddress.setText(bloodBank.getAddress());
        holder.textViewContact.setText("Contact: " + bloodBank.getContact());
    }

    @Override
    public int getItemCount() {
        return bloodBankList.size();
    }

    public static class BloodBankViewHolder extends RecyclerView.ViewHolder {
        TextView textViewName, textViewAddress, textViewContact;

        public BloodBankViewHolder(@NonNull View itemView) {
            super(itemView);
            textViewName = itemView.findViewById(R.id.textViewName);
            textViewAddress = itemView.findViewById(R.id.textViewAddress);
            textViewContact = itemView.findViewById(R.id.textViewContact);
        }
    }
}
