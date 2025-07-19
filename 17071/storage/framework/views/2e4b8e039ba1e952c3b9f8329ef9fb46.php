<?php $__env->startPush('header'); ?>
    <title>Update Profile</title>
<?php $__env->stopPush(); ?>
<?php $__env->startSection('content'); ?>
    <div class="card">
        <?php echo html()->form('PUT', route('admin.profile'))->attribute('enctype', 'multipart/form-data')->id('ajaxForm')->open(); ?>

        <h5 class="card-header">UPDATE PROFILE</h5>
        <div class="card-body">
            <div class="row">
                <div class="col-md-6 mt-3">
                    <?php if (isset($component)) { $__componentOriginal786b6632e4e03cdf0a10e8880993f28a = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal786b6632e4e03cdf0a10e8880993f28a = $attributes; } ?>
<?php $component = App\View\Components\Input::resolve(['name' => 'name','value' => auth('admin')->user()->name] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
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
                <div class="col-md-6 mt-3">
                    <?php if (isset($component)) { $__componentOriginal786b6632e4e03cdf0a10e8880993f28a = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal786b6632e4e03cdf0a10e8880993f28a = $attributes; } ?>
<?php $component = App\View\Components\Input::resolve(['name' => 'email','value' => auth('admin')->user()->email] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
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
            </div>
            <div class="row">
                <div class="col-md-6 mt-3">
                    <?php if (isset($component)) { $__componentOriginal786b6632e4e03cdf0a10e8880993f28a = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal786b6632e4e03cdf0a10e8880993f28a = $attributes; } ?>
<?php $component = App\View\Components\Input::resolve(['name' => 'mobile','value' => auth('admin')->user()->mobile] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
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
                <div class="col-md-6 mt-3">
                    <?php if (isset($component)) { $__componentOriginal97d4fd560170452a5149b35694a044c8 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal97d4fd560170452a5149b35694a044c8 = $attributes; } ?>
<?php $component = App\View\Components\Password::resolve(['name' => 'password'] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('password'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\App\View\Components\Password::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal97d4fd560170452a5149b35694a044c8)): ?>
<?php $attributes = $__attributesOriginal97d4fd560170452a5149b35694a044c8; ?>
<?php unset($__attributesOriginal97d4fd560170452a5149b35694a044c8); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal97d4fd560170452a5149b35694a044c8)): ?>
<?php $component = $__componentOriginal97d4fd560170452a5149b35694a044c8; ?>
<?php unset($__componentOriginal97d4fd560170452a5149b35694a044c8); ?>
<?php endif; ?>
                </div>
            </div>
            <div class="row">
                <div class="col-12 mt-3">
                    <?php if (isset($component)) { $__componentOriginal27a9ac474dd5f2a4b21bde3c2c880dc3 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal27a9ac474dd5f2a4b21bde3c2c880dc3 = $attributes; } ?>
<?php $component = App\View\Components\File::resolve(['name' => 'image'] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('file'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\App\View\Components\File::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal27a9ac474dd5f2a4b21bde3c2c880dc3)): ?>
<?php $attributes = $__attributesOriginal27a9ac474dd5f2a4b21bde3c2c880dc3; ?>
<?php unset($__attributesOriginal27a9ac474dd5f2a4b21bde3c2c880dc3); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal27a9ac474dd5f2a4b21bde3c2c880dc3)): ?>
<?php $component = $__componentOriginal27a9ac474dd5f2a4b21bde3c2c880dc3; ?>
<?php unset($__componentOriginal27a9ac474dd5f2a4b21bde3c2c880dc3); ?>
<?php endif; ?>
                </div>
            </div>
            <div class="d-flex justify-content-end pt-3">
                <button type="submit" id="submitBtn" class="btn btn-primary">Update</button>
            </div>
        </div>
        <?php echo e(html()->form()->close()); ?>

    </div>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('admin.layouts.main', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH D:\Project Website\townschool\resources\views/admin/profile.blade.php ENDPATH**/ ?>