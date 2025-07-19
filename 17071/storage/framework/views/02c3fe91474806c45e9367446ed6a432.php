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
        <b>Total Items : <?php echo e($students->count()); ?></b>
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
            <?php $__currentLoopData = $students; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $student): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
            <tr>
                <td><?php echo e($student->roll_no); ?></td>
                <td><?php echo e($student->admission_no); ?></td>
                <td><?php echo e($student->name); ?></td>
                <td><?php echo e($student->father_name); ?></td>
                <td><?php echo e($student->mobile_no); ?></td>
                <td><?php echo e($student->class); ?>

                <td><?php echo e($student->gender); ?></td>

                <td>
                    <div class="form-check form-switch mb-2">
                        <input class="form-check-input" value="Active" onchange="studentStatus(event)"
                            data-url="<?php echo e(route('admin.studentStatus', $student->id)); ?>" type="checkbox"
                            id="flexSwitchCheckChecked" <?php echo e($student->status == 'Active' ? 'checked' : null); ?>>
                    </div>
                </td>
                <td>
                    <div class="d-flex gap-2 align-items-center">
                         <a href="<?php echo e(route('admin.studentFeeCollet',$student->id)); ?>" class="btnn-sm" style="font-size: 12px">  Fee</a>
                    </div>
                </td>
            </tr>
            <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
        </tbody>
    </table>
</div>
<?php /**PATH D:\Project Website\townschool\resources\views/admin/export/students.blade.php ENDPATH**/ ?>