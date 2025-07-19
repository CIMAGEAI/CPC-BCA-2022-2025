<style>
    table tr th {
        text-transform: capitalize;
        border: 1px solid;

    }

    table tr td {
        border: 1px solid;
    }
    .btnn-sm{
        font-size: 10px;
        padding: 3px 8px;
        border-radius: 5px;
        background: rgb(34, 172, 0);
        color: white;
    }
    .btnn-sm:hover{
        color: #fff;
    }
</style>
<div class="table-responsive">
    <div class="d-flex justify-content-between align-items-center py-3">
        <button onclick="exportToCSV()" class="btn btn-sm btn-primary">Export to CSV</button>
        <b>Total Items : {{ $students->count() }}</b>
    </div>
    <table class="table">
        <thead>
            <tr>
                <th>Roll No</th>
                <th>Student id</th>
                <th>Student Name</th>
                <th>Father Name</th>
                <th>Mobile No</th>
                <th>Class</th>
                <th>Gender</th>
                <th>Status</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($students as $student)
            <tr>
                <td>{{ $student->roll_no }}</td>
                <td>{{ $student->admission_no }}</td>
                <td>{{ $student->name }}</td>
                <td>{{ $student->father_name }}</td>
                <td>{{ $student->mobile_no }}</td>
                <td>{{ $student->class }}
                <td>{{ $student->gender }}</td>

                <td>
                    <div class="form-check form-switch mb-2">
                        <input class="form-check-input" value="Active" onchange="studentStatus(event)"
                            data-url="{{ route('admin.studentStatus', $student->id) }}" type="checkbox"
                            id="flexSwitchCheckChecked" {{ $student->status == 'Active' ? 'checked' : null }}>
                    </div>
                </td>
                <td>
                    <div class="d-flex gap-2 align-items-center">
                         <a href="{{ route('admin.studentFeeCollet',$student->id) }}" class="btnn-sm" style="font-size: 12px">  Fee</a>
                    </div>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
</div>
