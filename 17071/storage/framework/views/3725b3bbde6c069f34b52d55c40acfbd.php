<div class="col-lg-4 col-sm-6">
    <div class="">
        <div class="card " style="background:<?php echo e($bgColor); ?>;    height: 260px;">
            <div class="row">
                <div class="col-6">
                    <div class="card-body">
                        <div class="card-info mb-3 py-2 mb-lg-1 mb-xl-3">
                            <h5 class="mb-3 mb-lg-2 mb-xl-3 text-nowrap"> <?php echo e($name); ?></h5>
                            <div class="badge bg-label-primary rounded-pill lh-xs"><?php echo e($date); ?></div>
                        </div>
                        <div class="d-flex align-items-end flex-wrap gap-1">
                            <h4 class="mb-0 me-2"><?php echo e($value); ?></h4>
                        </div>
                    </div>
                </div>
                <div class="col-6 text-end d-flex align-items-end justify-content-center">
                    <div class="card-body pb-0 pt-3 position-absolute bottom-0">
                        <img src="<?php echo e(publicPath('/')); ?><?php echo e($img); ?>" alt="Ratings" width="<?php echo e($width); ?>" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<?php /**PATH D:\project\townschool\resources\views/components/card.blade.php ENDPATH**/ ?>