<html lang="en" class="light-style layout-navbar-fixed layout-menu-fixed" dir="ltr" data-theme="theme-default"
    data-assets-path="<?php echo e(publicPath('assets/')); ?>" data-template="vertical-menu-template">
<?php echo $__env->make('common.header', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
<title>Login to town school</title>
<link rel="stylesheet" href="<?php echo e(publicPath('assets/vendor/css/pages/page-auth.css')); ?>" />

<body style="overflow-x: hidden">
    <div class="position-relative">
        <div class="authentication-wrapper authentication-basic container-p-y">
            <div class="authentication-inner py-4">
                <div class="card p-2 background-overlay"
                    style="background-image: url(<?php echo e(route('assets', ['folder' => 'assets', 'subfolder' => 'background', 'file' => 'login.jpg'])); ?>);">
                    <div class="card-body mt-2">
                        <div class="d-flex justify-content-center">
                            <img class="shadow-lg" src="<?php echo e(route('uploads', ['folder' => 'assets', 'file' => 'logo.jpg'])); ?>"
                                height="150px" style="border-radius: 50%;border: 1px solid rgba(160, 35, 255, 0.933)">
                        </div>
                        <form id="formAuthentication" class="mb-3" action="<?php echo e(route('admin.login')); ?>" method="POST">
                            <?php if (isset($component)) { $__componentOriginal786b6632e4e03cdf0a10e8880993f28a = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal786b6632e4e03cdf0a10e8880993f28a = $attributes; } ?>
<?php $component = App\View\Components\Input::resolve(['name' => 'email','value' => ''.e(old('email')).''] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
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
                            <div class="my-3">
                                <div class="form-password-toggle position-relative"
                                    style="position: relative !important;">
                                    <?php if (isset($component)) { $__componentOriginal97d4fd560170452a5149b35694a044c8 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal97d4fd560170452a5149b35694a044c8 = $attributes; } ?>
<?php $component = App\View\Components\Password::resolve(['name' => 'password','value' => ''.e(old('password')).''] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
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
                                    <div style="position: absolute !important;top:28;right:15;">
                                        <i class="mdi mdi-eye-off-outline"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="mb-3 d-flex justify-content-between">
                                <?php if (isset($component)) { $__componentOriginal29f3e5beab852ff66871181e8857b9b3 = $component; } ?>
<?php if (isset($attributes)) { $__attributesOriginal29f3e5beab852ff66871181e8857b9b3 = $attributes; } ?>
<?php $component = App\View\Components\Checkbox::resolve(['name' => 'remember','label' => 'Remember Me','checked' => ''.e(old('remember')).'','value' => '1'] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? $attributes->all() : [])); ?>
<?php $component->withName('checkbox'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag): ?>
<?php $attributes = $attributes->except(\App\View\Components\Checkbox::ignoredParameterNames()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__attributesOriginal29f3e5beab852ff66871181e8857b9b3)): ?>
<?php $attributes = $__attributesOriginal29f3e5beab852ff66871181e8857b9b3; ?>
<?php unset($__attributesOriginal29f3e5beab852ff66871181e8857b9b3); ?>
<?php endif; ?>
<?php if (isset($__componentOriginal29f3e5beab852ff66871181e8857b9b3)): ?>
<?php $component = $__componentOriginal29f3e5beab852ff66871181e8857b9b3; ?>
<?php unset($__componentOriginal29f3e5beab852ff66871181e8857b9b3); ?>
<?php endif; ?>
                                
                            </div>
                            <?php echo csrf_field(); ?>
                            <div class="mb-3">
                                <button class="btn btn-primary d-grid w-100" type="submit">Sign in</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <?php echo $__env->make('common.footer', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
<?php /**PATH D:\Project Website\townschool\resources\views/admin/login.blade.php ENDPATH**/ ?>