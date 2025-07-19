<?php $__env->startPush('header'); ?>
<title>Student List </title>
<link rel="stylesheet" href="<?php echo e(publicPath('assets/vendor/libs/select2/select2.css')); ?>" />
<style>
    .tabel-x tr th {
        text-transform: capitalize;
        border: 1px solid;
        text-wrap: nowrap;
        font-size: 12px;

    }

    .tabel-x tr td {
        font-size: 12px;
        border: 1px solid;
    }
    .modal-backdrop.fade.show{
        display: none;
    }
    table tr th{
        border: 1px solid;
    }
    table tr td{
        border: 1px solid;
    }
</style>
<?php $__env->stopPush(); ?>
<?php $__env->startSection('content'); ?>
        <div class="card">
            <h5 class="card-header">Students Fees</h5>


            <div class="table-responsive text-nowrap">
                <table class="table tabel-x">
                <tr>
                    <td rowspan="6" style="text-align: center;border: 1px solid #000">
                        <img class="shadow-lg" src="<?php echo e(route('uploads', ['folder' => 'assets', 'file' => 'logo.jpg'])); ?>"
                        height="150px" style="border-radius: 50%;border: 1px solid rgba(160, 35, 255, 0.933)">
                    </td>

                    <th>Name</th>
                    <td><?php echo e($student->name); ?></td>
                    <th>Class (Section)</th>
                    <td><?php echo e($student->class); ?></td>
                </tr>
                <tr>
                    <th>Father Name</th>
                    <td><?php echo e($student->father_name); ?></td>
                    <th>Admission No</th>
                    <td><?php echo e($student->admission_no); ?></td>
                </tr>
                <tr>
                    <th>Mobile Number</th>
                    <td><?php echo e($student->mobile_no); ?></td>
                    <th>Roll Number</th>
                    <td><?php echo e($student->roll_no); ?></td>
                </tr>
                <tr>
                    <th>Admission Date</th>
                    <td><?php echo e(isset($student->admission_date)?$student->admission_date->format('Y-m-d'):null); ?></td>
                    <th>RTE</th>
                    <td class="no">No</td>
                </tr>
                <tr>
                    <td colspan="4" style="text-align: right;">Date: 02/02/2025</td>
                </tr>
            </table>
            <div class="buttons my-3">
                <a href="javascript:void(0);" id="print-selected" class="btn btn-sm bg-black text-white" style="border-radius: 0">Print Selected</a>

                <button class="btn btn-sm bg-warning text-white" style="border-radius: 0">Collect Selected</button>

                <button class="btn btn-sm bg-primary editBtn text-white" style="border-radius: 0" data-bs-toggle="modal"
                data-bs-target="#editDataModal" data-bs-name="<?php echo e($student->name); ?>"
                data-bs-father_name="<?php echo e($student->father_name); ?>"  data-bs-mobile_no="<?php echo e($student->mobile_no); ?>"
                data-bs-email="<?php echo e($student->email); ?>"  data-bs-class="<?php echo e($student->class); ?>"  data-bs-admission_date="<?php echo e(isset($student->admission_date)? $student->admission_date->format('Y-m-d'):null); ?>"
                data-bs-roll_no="<?php echo e($student->roll_no); ?>"  data-bs-dob="<?php echo e($student->dob->format('Y-m-d')); ?>"
                data-bs-gender="<?php echo e($student->gender); ?>"  data-bs-category="<?php echo e($student->category); ?>"
                data-bs-second_mobile_no="<?php echo e($student->second_mobile_no); ?>"  data-bs-religion="<?php echo e($student->religion); ?>"
                data-bs-cast="<?php echo e($student->cast); ?>"  data-bs-cast="<?php echo e($student->cast); ?>"
                data-bs-address="<?php echo e($student->address); ?>" data-bs-pincode="<?php echo e($student->pincode); ?>"
                data-bs-url="<?php echo e(route('admin.student.update', $student->id)); ?>"> Edit Student</button>

            </div>
            </div>

            <br>
            <div class="table-responsive text-nowrap">
                <table class="table">
                    <thead>
                        <tr>
                            <th><input type="checkbox" id="select-all"></th>
                            <th>Month</th>
                            <th>Fee</th>
                            <th>Status</th>
                            <th>Fee Type</th>
                            <th class="text-center" width="10%">Action</th>
                        </tr>
                    </thead>
                    <tbody>

                        <?php
                            $feeAmount=0;
                            $otherAmount=0;
                            $payAmount=0;
                        ?>
                        <?php $__currentLoopData = $fees; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $fee): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                            <?php
                                $feeMonth =   \App\Models\StudentFeePayment::where('student_id',$student->id)->where('month',$fee->month)->first();
                            ?>
                            <tr>
                                <td></td>
                                <td><?php echo e($fee->month); ?>  <span class="fw-bold">Type: <?php echo e($fee->feeType); ?></span> </td>
                                <td>
                                  <?php echo e($fee->fee); ?>

                                </td>
                                <td>
                                    <?php if(!$feeMonth): ?>
                                     <span class="bg-danger px-2 py-1 rounded text-white " style="font-size: 12px;border-radius: 0">Not Paid</span>
                                     <?php else: ?>
                                     <span class="bg-success px-2 py-1 rounded text-white " style="font-size: 12px;border-radius: 0">Paid</span>

                                    <?php endif; ?>
                                </td>
                                <td><?php echo e($fee->month); ?></td>
                                <td>

                                   <div class="d-flex gap-2">
                                    <?php if(!$feeMonth): ?>
                                        <button class="btn btn-sm bg-success text-white btnCollect" style="border-radius: 0"   data-bs-toggle="modal"
                                        data-bs-target="#collectMoney" data-bs-name="<?php echo e($student->name); ?>"
                                        data-bs-amount=<?php echo e($fee->fee); ?>

                                        data-bs-url="<?php echo e(route('admin.studentPayment',['id'=>$student->id,'feeId'=>$fee->id])); ?>"> <span class="mdi mdi-currency-rupee"></span> Collect</button>
                                    <?php else: ?>
                                    <a class="btn btn-sm btn-danger" href="javascript:void(0);" style="border-radius: 0"
                                        onclick="confirmRetrieval('<?php echo e(route('admin.studentPaymentDelete',['id'=>$feeMonth->id])); ?>')">
                                        <span class="mdi mdi-undo-variant"></span> Retrieve
                                    </a>
                                        <a target="_blank" href="<?php echo e(route('admin.studentPaymentInvoice',['id'=>$feeMonth->id])); ?>" class="btn btn-sm bg-primary text-white" style="border-radius: 0"> <span class="mdi mdi-printer-outline"></span> Print </a>
                                    <?php endif; ?>
                                   </div>
                                </td>
                            </tr>
                            <?php if(isset($feeMonth)): ?>
                            <?php
                             $payAmount+=$feeMonth->fee;
                             $otherAmount+=$feeMonth->other;
                            ?>
                            <tr>
                                <td>   <input type="checkbox" class="fee-checkbox" value="<?php echo e($feeMonth->id); ?>"></td>
                                <td></td>
                                <td><?php echo e($feeMonth->fee); ?></td>
                                <td><?php echo e($feeMonth->other); ?></td>
                                <td><?php echo e($feeMonth->remark); ?></td>
                            </tr>
                            <?php endif; ?>


                        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                        <tr>
                            <td><b>Total</b></td>
                            <td><b><?php echo e(numberFormat($fees->sum('fee') )); ?></b></td>
                            <td style="font-weight: bold"><?php echo e(numberFormat($payAmount)); ?></td>
                            <td><b><?php echo e(numberFormat($otherAmount)); ?></b></td>
                            <td></td>
                            
                        </tr>
                        <td>
                            <td colspan="3">Grand Total</td>
                            <td colspan="2"><?php echo e(numberFormat($otherAmount+$fees->sum('fee'))); ?></td>
                        </td>
                    </tbody>
                </table>
            </div>
        </div>
<?php $__env->stopSection(); ?>

<div class="modal fade" id="editDataModal" tabindex="-1" role="dialog" aria-labelledby="editModal" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="editModal">Student Edit</h5>
                <button data-bs-dismiss="modal" type="button"
                    class="btn-sm btn btn-icon btn-label-github waves-effect close" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <?php echo html()->form('PUT', route('admin.student.create'))->id('ajaxEditForm')->open(); ?>

            <div class="modal-body">
                <div class="row">
                    <!-- Name -->
                    <div class="col-md-4 my-2">
                        <?php if (isset($component)) { $__componentOriginal786b6632e4e03cdf0a10e8880993f28a = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal786b6632e4e03cdf0a10e8880993f28a = $attributes; } ?>
<?php $component = App\View\Components\Input::resolve(['label' => 'Name','name' => 'name','id' => 'edit'] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('input'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\App\View\Components\Input::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['required' => true]); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal786b6632e4e03cdf0a10e8880993f28a)): ?>
<?php $attributes = $__attributesOriginal786b6632e4e03cdf0a10e8880993f28a; ?>
<?php unset($__attributesOriginal786b6632e4e03cdf0a10e8880993f28a); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal786b6632e4e03cdf0a10e8880993f28a)): ?>
<?php $component = $__componentOriginal786b6632e4e03cdf0a10e8880993f28a; ?>
<?php unset($__componentOriginal786b6632e4e03cdf0a10e8880993f28a); ?>
<?php endif; ?>
                    </div>

                    <!-- Email -->
                    <div class="col-md-4 my-2">
                        <?php if (isset($component)) { $__componentOriginal786b6632e4e03cdf0a10e8880993f28a = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal786b6632e4e03cdf0a10e8880993f28a = $attributes; } ?>
<?php $component = App\View\Components\Input::resolve(['label' => 'Email','name' => 'email','id' => 'edit'] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('input'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\App\View\Components\Input::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['type' => 'email']); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal786b6632e4e03cdf0a10e8880993f28a)): ?>
<?php $attributes = $__attributesOriginal786b6632e4e03cdf0a10e8880993f28a; ?>
<?php unset($__attributesOriginal786b6632e4e03cdf0a10e8880993f28a); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal786b6632e4e03cdf0a10e8880993f28a)): ?>
<?php $component = $__componentOriginal786b6632e4e03cdf0a10e8880993f28a; ?>
<?php unset($__componentOriginal786b6632e4e03cdf0a10e8880993f28a); ?>
<?php endif; ?>
                    </div>

                    <!-- Mobile -->
                    <div class="col-md-4 my-2">
                        <?php if (isset($component)) { $__componentOriginal786b6632e4e03cdf0a10e8880993f28a = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal786b6632e4e03cdf0a10e8880993f28a = $attributes; } ?>
<?php $component = App\View\Components\Input::resolve(['label' => 'Mobile Number','id' => 'edit','name' => 'mobile_no'] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('input'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\App\View\Components\Input::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['required' => true]); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal786b6632e4e03cdf0a10e8880993f28a)): ?>
<?php $attributes = $__attributesOriginal786b6632e4e03cdf0a10e8880993f28a; ?>
<?php unset($__attributesOriginal786b6632e4e03cdf0a10e8880993f28a); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal786b6632e4e03cdf0a10e8880993f28a)): ?>
<?php $component = $__componentOriginal786b6632e4e03cdf0a10e8880993f28a; ?>
<?php unset($__componentOriginal786b6632e4e03cdf0a10e8880993f28a); ?>
<?php endif; ?>
                    </div>

                    <div class="col-md-4 my-2">
                        <?php if (isset($component)) { $__componentOriginal786b6632e4e03cdf0a10e8880993f28a = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal786b6632e4e03cdf0a10e8880993f28a = $attributes; } ?>
<?php $component = App\View\Components\Input::resolve(['label' => 'Father\'s Name','id' => 'edit','name' => 'father_name'] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('input'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\App\View\Components\Input::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['required' => true]); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal786b6632e4e03cdf0a10e8880993f28a)): ?>
<?php $attributes = $__attributesOriginal786b6632e4e03cdf0a10e8880993f28a; ?>
<?php unset($__attributesOriginal786b6632e4e03cdf0a10e8880993f28a); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal786b6632e4e03cdf0a10e8880993f28a)): ?>
<?php $component = $__componentOriginal786b6632e4e03cdf0a10e8880993f28a; ?>
<?php unset($__componentOriginal786b6632e4e03cdf0a10e8880993f28a); ?>
<?php endif; ?>
                    </div>


                    <!-- Roll Number -->
                    <div class="col-md-4 my-2">
                        <?php if (isset($component)) { $__componentOriginal786b6632e4e03cdf0a10e8880993f28a = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal786b6632e4e03cdf0a10e8880993f28a = $attributes; } ?>
<?php $component = App\View\Components\Input::resolve(['label' => 'Roll No','id' => 'edit','name' => 'roll_no'] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('input'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\App\View\Components\Input::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['type' => 'number','required' => true]); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal786b6632e4e03cdf0a10e8880993f28a)): ?>
<?php $attributes = $__attributesOriginal786b6632e4e03cdf0a10e8880993f28a; ?>
<?php unset($__attributesOriginal786b6632e4e03cdf0a10e8880993f28a); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal786b6632e4e03cdf0a10e8880993f28a)): ?>
<?php $component = $__componentOriginal786b6632e4e03cdf0a10e8880993f28a; ?>
<?php unset($__componentOriginal786b6632e4e03cdf0a10e8880993f28a); ?>
<?php endif; ?>
                    </div>

                    <!-- Class -->
                    <div class="col-md-4 my-2">
                        <?php if (isset($component)) { $__componentOriginalbf566fc26595b9cc6779e170beef8a5a = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginalbf566fc26595b9cc6779e170beef8a5a = $attributes; } ?>
<?php $component = App\View\Components\Select::resolve(['name' => 'class','class' => 'select2','value' =>  old('class'),'list' => \App\Utils\SelectionList::classList(),'label' => 'Class','id' => 'edit','placeholderSelect2' => 'Class'] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('select'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\App\View\Components\Select::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginalbf566fc26595b9cc6779e170beef8a5a)): ?>
<?php $attributes = $__attributesOriginalbf566fc26595b9cc6779e170beef8a5a; ?>
<?php unset($__attributesOriginalbf566fc26595b9cc6779e170beef8a5a); ?>
<?php endif; ?>
<?php if (isset($__componentOriginalbf566fc26595b9cc6779e170beef8a5a)): ?>
<?php $component = $__componentOriginalbf566fc26595b9cc6779e170beef8a5a; ?>
<?php unset($__componentOriginalbf566fc26595b9cc6779e170beef8a5a); ?>
<?php endif; ?>
                    </div>

                    <!-- Date of Birth -->
                    <div class="col-md-4 my-2">
                        <?php if (isset($component)) { $__componentOriginal786b6632e4e03cdf0a10e8880993f28a = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal786b6632e4e03cdf0a10e8880993f28a = $attributes; } ?>
<?php $component = App\View\Components\Input::resolve(['label' => 'Date of Birth','name' => 'dob','id' => 'edit'] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('input'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\App\View\Components\Input::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['type' => 'date','required' => true]); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal786b6632e4e03cdf0a10e8880993f28a)): ?>
<?php $attributes = $__attributesOriginal786b6632e4e03cdf0a10e8880993f28a; ?>
<?php unset($__attributesOriginal786b6632e4e03cdf0a10e8880993f28a); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal786b6632e4e03cdf0a10e8880993f28a)): ?>
<?php $component = $__componentOriginal786b6632e4e03cdf0a10e8880993f28a; ?>
<?php unset($__componentOriginal786b6632e4e03cdf0a10e8880993f28a); ?>
<?php endif; ?>
                    </div>
                    <div class="col-md-4 my-2">
                        <?php if (isset($component)) { $__componentOriginal786b6632e4e03cdf0a10e8880993f28a = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal786b6632e4e03cdf0a10e8880993f28a = $attributes; } ?>
<?php $component = App\View\Components\Input::resolve(['label' => 'Date of Admission','name' => 'admission_date','id' => 'edit'] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('input'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\App\View\Components\Input::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['type' => 'date','required' => true]); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal786b6632e4e03cdf0a10e8880993f28a)): ?>
<?php $attributes = $__attributesOriginal786b6632e4e03cdf0a10e8880993f28a; ?>
<?php unset($__attributesOriginal786b6632e4e03cdf0a10e8880993f28a); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal786b6632e4e03cdf0a10e8880993f28a)): ?>
<?php $component = $__componentOriginal786b6632e4e03cdf0a10e8880993f28a; ?>
<?php unset($__componentOriginal786b6632e4e03cdf0a10e8880993f28a); ?>
<?php endif; ?>
                    </div>

                    <!-- Gender -->
                    <div class="col-md-4 my-2">
                        <?php if (isset($component)) { $__componentOriginalbf566fc26595b9cc6779e170beef8a5a = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginalbf566fc26595b9cc6779e170beef8a5a = $attributes; } ?>
<?php $component = App\View\Components\Select::resolve(['class' => 'select2','name' => 'gender','list' => \App\Utils\SelectionList::genderList(),'id' => 'gender'] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('select'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\App\View\Components\Select::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginalbf566fc26595b9cc6779e170beef8a5a)): ?>
<?php $attributes = $__attributesOriginalbf566fc26595b9cc6779e170beef8a5a; ?>
<?php unset($__attributesOriginalbf566fc26595b9cc6779e170beef8a5a); ?>
<?php endif; ?>
<?php if (isset($__componentOriginalbf566fc26595b9cc6779e170beef8a5a)): ?>
<?php $component = $__componentOriginalbf566fc26595b9cc6779e170beef8a5a; ?>
<?php unset($__componentOriginalbf566fc26595b9cc6779e170beef8a5a); ?>
<?php endif; ?>
                    </div>

                    <!-- Category -->
                    <div class="col-md-4 my-2">
                        <?php if (isset($component)) { $__componentOriginal786b6632e4e03cdf0a10e8880993f28a = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal786b6632e4e03cdf0a10e8880993f28a = $attributes; } ?>
<?php $component = App\View\Components\Input::resolve(['label' => 'Category','id' => 'edit','name' => 'category'] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('input'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\App\View\Components\Input::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal786b6632e4e03cdf0a10e8880993f28a)): ?>
<?php $attributes = $__attributesOriginal786b6632e4e03cdf0a10e8880993f28a; ?>
<?php unset($__attributesOriginal786b6632e4e03cdf0a10e8880993f28a); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal786b6632e4e03cdf0a10e8880993f28a)): ?>
<?php $component = $__componentOriginal786b6632e4e03cdf0a10e8880993f28a; ?>
<?php unset($__componentOriginal786b6632e4e03cdf0a10e8880993f28a); ?>
<?php endif; ?>
                    </div>

                    <!-- Secondary Mobile -->
                    <div class="col-md-4 my-2">
                        <?php if (isset($component)) { $__componentOriginal786b6632e4e03cdf0a10e8880993f28a = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal786b6632e4e03cdf0a10e8880993f28a = $attributes; } ?>
<?php $component = App\View\Components\Input::resolve(['label' => 'Secondary Mobile','id' => 'edit','name' => 'second_mobile_no'] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('input'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\App\View\Components\Input::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal786b6632e4e03cdf0a10e8880993f28a)): ?>
<?php $attributes = $__attributesOriginal786b6632e4e03cdf0a10e8880993f28a; ?>
<?php unset($__attributesOriginal786b6632e4e03cdf0a10e8880993f28a); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal786b6632e4e03cdf0a10e8880993f28a)): ?>
<?php $component = $__componentOriginal786b6632e4e03cdf0a10e8880993f28a; ?>
<?php unset($__componentOriginal786b6632e4e03cdf0a10e8880993f28a); ?>
<?php endif; ?>
                    </div>

                    <!-- Religion -->
                    <div class="col-md-4 my-2">
                        <?php if (isset($component)) { $__componentOriginal786b6632e4e03cdf0a10e8880993f28a = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal786b6632e4e03cdf0a10e8880993f28a = $attributes; } ?>
<?php $component = App\View\Components\Input::resolve(['label' => 'Religion','name' => 'religion','id' => 'edit'] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('input'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\App\View\Components\Input::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal786b6632e4e03cdf0a10e8880993f28a)): ?>
<?php $attributes = $__attributesOriginal786b6632e4e03cdf0a10e8880993f28a; ?>
<?php unset($__attributesOriginal786b6632e4e03cdf0a10e8880993f28a); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal786b6632e4e03cdf0a10e8880993f28a)): ?>
<?php $component = $__componentOriginal786b6632e4e03cdf0a10e8880993f28a; ?>
<?php unset($__componentOriginal786b6632e4e03cdf0a10e8880993f28a); ?>
<?php endif; ?>
                    </div>

                    <!-- Cast -->
                    <div class="col-md-4 my-2">
                        <?php if (isset($component)) { $__componentOriginal786b6632e4e03cdf0a10e8880993f28a = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal786b6632e4e03cdf0a10e8880993f28a = $attributes; } ?>
<?php $component = App\View\Components\Input::resolve(['label' => 'Cast','name' => 'cast','id' => 'edit'] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('input'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\App\View\Components\Input::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal786b6632e4e03cdf0a10e8880993f28a)): ?>
<?php $attributes = $__attributesOriginal786b6632e4e03cdf0a10e8880993f28a; ?>
<?php unset($__attributesOriginal786b6632e4e03cdf0a10e8880993f28a); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal786b6632e4e03cdf0a10e8880993f28a)): ?>
<?php $component = $__componentOriginal786b6632e4e03cdf0a10e8880993f28a; ?>
<?php unset($__componentOriginal786b6632e4e03cdf0a10e8880993f28a); ?>
<?php endif; ?>
                    </div>

                    <!-- Pincode -->
                    <div class="col-md-4 my-2">
                        <?php if (isset($component)) { $__componentOriginal786b6632e4e03cdf0a10e8880993f28a = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal786b6632e4e03cdf0a10e8880993f28a = $attributes; } ?>
<?php $component = App\View\Components\Input::resolve(['label' => 'Pincode','name' => 'pincode','id' => 'edit'] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('input'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\App\View\Components\Input::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal786b6632e4e03cdf0a10e8880993f28a)): ?>
<?php $attributes = $__attributesOriginal786b6632e4e03cdf0a10e8880993f28a; ?>
<?php unset($__attributesOriginal786b6632e4e03cdf0a10e8880993f28a); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal786b6632e4e03cdf0a10e8880993f28a)): ?>
<?php $component = $__componentOriginal786b6632e4e03cdf0a10e8880993f28a; ?>
<?php unset($__componentOriginal786b6632e4e03cdf0a10e8880993f28a); ?>
<?php endif; ?>
                    </div>

                    <!-- Image -->
                    <div class="col-md-4 my-2">
                        <?php if (isset($component)) { $__componentOriginal786b6632e4e03cdf0a10e8880993f28a = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal786b6632e4e03cdf0a10e8880993f28a = $attributes; } ?>
<?php $component = App\View\Components\Input::resolve(['label' => 'Image','name' => 'image'] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('input'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\App\View\Components\Input::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes(['type' => 'file']); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal786b6632e4e03cdf0a10e8880993f28a)): ?>
<?php $attributes = $__attributesOriginal786b6632e4e03cdf0a10e8880993f28a; ?>
<?php unset($__attributesOriginal786b6632e4e03cdf0a10e8880993f28a); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal786b6632e4e03cdf0a10e8880993f28a)): ?>
<?php $component = $__componentOriginal786b6632e4e03cdf0a10e8880993f28a; ?>
<?php unset($__componentOriginal786b6632e4e03cdf0a10e8880993f28a); ?>
<?php endif; ?>
                    </div>
                    <!-- Address -->
                    <div class="col-md-12 my-2">
                        <?php if (isset($component)) { $__componentOriginal3eecbdc2ff443417d4584c73662ed811 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal3eecbdc2ff443417d4584c73662ed811 = $attributes; } ?>
<?php $component = App\View\Components\TextArea::resolve(['label' => 'Address','id' => 'edit','name' => 'address','value' => ''.e(old('address')).''] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('text-area'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\App\View\Components\TextArea::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal3eecbdc2ff443417d4584c73662ed811)): ?>
<?php $attributes = $__attributesOriginal3eecbdc2ff443417d4584c73662ed811; ?>
<?php unset($__attributesOriginal3eecbdc2ff443417d4584c73662ed811); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal3eecbdc2ff443417d4584c73662ed811)): ?>
<?php $component = $__componentOriginal3eecbdc2ff443417d4584c73662ed811; ?>
<?php unset($__componentOriginal3eecbdc2ff443417d4584c73662ed811); ?>
<?php endif; ?>
                    </div>
                </div>

            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="modal">Close</button>
                <button type="button" id="updateBtn" class="btn btn-primary btn-sm">Update</button>
            </div>
            <?php echo e(html()->form()->close()); ?>

        </div>
    </div>
</div>

<div class="modal fade" id="collectMoney" tabindex="-1" role="dialog" aria-labelledby="collectMoney" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title border-bottom" id="editModal">Student Fee Collect</h5>
                <button  type="button"
                    class="btn-sm btn btn-icon btn-label-github waves-effect close closeModal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <?php echo html()->form('PUT', route('admin.student.create'))->id('modalPaymentForm')->open(); ?>

            <div class="modal-body">
                <div class="row">
                 <div class="d-flex justify-content-between align-items-center">
                    <p class="p-0 m-0 mb-1"><strong>Student Name:</strong> <span id="modalStudentName"></span></p>
                    <p class="p-0 m-0 mb-1"><strong>Amount:</strong> ₹<span id="modalAmount"></span></p>
                 </div>
                    <!-- Name -->
                    <div class="col-md-6 my-2">
                        <?php if (isset($component)) { $__componentOriginal786b6632e4e03cdf0a10e8880993f28a = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal786b6632e4e03cdf0a10e8880993f28a = $attributes; } ?>
<?php $component = App\View\Components\Input::resolve(['label' => 'Name','name' => 'name'] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('input'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\App\View\Components\Input::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal786b6632e4e03cdf0a10e8880993f28a)): ?>
<?php $attributes = $__attributesOriginal786b6632e4e03cdf0a10e8880993f28a; ?>
<?php unset($__attributesOriginal786b6632e4e03cdf0a10e8880993f28a); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal786b6632e4e03cdf0a10e8880993f28a)): ?>
<?php $component = $__componentOriginal786b6632e4e03cdf0a10e8880993f28a; ?>
<?php unset($__componentOriginal786b6632e4e03cdf0a10e8880993f28a); ?>
<?php endif; ?>
                    </div>

                    <!-- Religion -->
                    <div class="col-md-6 my-2">
                        <?php if (isset($component)) { $__componentOriginal786b6632e4e03cdf0a10e8880993f28a = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal786b6632e4e03cdf0a10e8880993f28a = $attributes; } ?>
<?php $component = App\View\Components\Input::resolve(['label' => 'other','name' => 'other'] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('input'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\App\View\Components\Input::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal786b6632e4e03cdf0a10e8880993f28a)): ?>
<?php $attributes = $__attributesOriginal786b6632e4e03cdf0a10e8880993f28a; ?>
<?php unset($__attributesOriginal786b6632e4e03cdf0a10e8880993f28a); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal786b6632e4e03cdf0a10e8880993f28a)): ?>
<?php $component = $__componentOriginal786b6632e4e03cdf0a10e8880993f28a; ?>
<?php unset($__componentOriginal786b6632e4e03cdf0a10e8880993f28a); ?>
<?php endif; ?>
                    </div>

                    <!-- Address -->
                    <div class="col-md-12 my-2">
                        <?php if (isset($component)) { $__componentOriginal3eecbdc2ff443417d4584c73662ed811 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal3eecbdc2ff443417d4584c73662ed811 = $attributes; } ?>
<?php $component = App\View\Components\TextArea::resolve(['label' => 'Remark','name' => 'remark','value' => ''.e(old('remark')).''] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('text-area'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\App\View\Components\TextArea::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal3eecbdc2ff443417d4584c73662ed811)): ?>
<?php $attributes = $__attributesOriginal3eecbdc2ff443417d4584c73662ed811; ?>
<?php unset($__attributesOriginal3eecbdc2ff443417d4584c73662ed811); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal3eecbdc2ff443417d4584c73662ed811)): ?>
<?php $component = $__componentOriginal3eecbdc2ff443417d4584c73662ed811; ?>
<?php unset($__componentOriginal3eecbdc2ff443417d4584c73662ed811); ?>
<?php endif; ?>
                    </div>
                </div>

            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary btn-sm closeModal" >Close</button>
                <button  type="submit" class="btn btn-primary btn-sm">Collect</button>
            </div>
            <?php echo e(html()->form()->close()); ?>

        </div>
    </div>
</div>

<?php $__env->startPush('script'); ?>
<script src="<?php echo e(publicPath('assets/vendor/libs/select2/select2.js')); ?>"></script>
<script src="<?php echo e(publicPath('assets/js/forms-selects.js')); ?>"></script>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script>
    function confirmRetrieval(url) {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you really want to retrieve this payment?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, Retrieve it!",
            cancelButtonText: "Cancel"
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = url;
            }
        });
    }
</script>
<script>
    document.addEventListener("DOMContentLoaded", function () {
        // Select all checkboxes
        document.getElementById("select-all").addEventListener("change", function () {
            let checkboxes = document.querySelectorAll(".fee-checkbox");
            checkboxes.forEach((checkbox) => {
                checkbox.checked = this.checked;
            });
        });

        // Print Selected Button Click
        document.getElementById("print-selected").addEventListener("click", function () {
            let selectedFees = [];
            document.querySelectorAll(".fee-checkbox:checked").forEach((checkbox) => {
                selectedFees.push(checkbox.value);
            });

            if (selectedFees.length === 0) {
                alert("Please select at least one fee to print.");
                return;
            }

            let url = "<?php echo e(route('admin.studentPrint')); ?>?ids=" + selectedFees.join(",");
            window.open(url, "_blank");
        });
    });
</script>

<script>
    document.addEventListener("DOMContentLoaded", function () {
        document.querySelectorAll(".btnCollect").forEach(button => {
            button.addEventListener("click", function () {
                let studentName = this.getAttribute("data-bs-name");
                let amount = this.getAttribute("data-bs-amount");
                let paymentUrl = this.getAttribute("data-bs-url");
                console.log(studentName);
                document.getElementById("add-name").value = studentName;
                document.getElementById("modalStudentName").textContent = studentName;
                document.getElementById("modalAmount").textContent = amount;
                document.getElementById("modalPaymentForm").setAttribute("action", paymentUrl);
                let modal = new bootstrap.Modal(document.getElementById("collectMoney"));
                modal.show();
            });
        });

        document.querySelectorAll(".closeModal").forEach(button => {
            button.addEventListener("click", function () {
                let modal = bootstrap.Modal.getInstance(document.getElementById("collectMoney"));
                if (modal) {
                    modal.hide();
                    console.log(123);
                }
            });
        });

    });

</script>
<?php $__env->stopPush(); ?>

<?php echo $__env->make('admin.layouts.main', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH D:\Project Website\townschool\resources\views/admin/student/studentFeeDetail.blade.php ENDPATH**/ ?>