<!DOCTYPE html>
<html lang="en" class="light-style layout-navbar-fixed layout-menu-fixed" dir="ltr" data-theme="theme-default"
    data-assets-path="{{ publicPath('assets/') }}" data-template="vertical-menu-template">
@include('common.header')
<style>
    #preloader {
        position: fixed;
        width: 100%;
        height: 100vh;
        background: #ffffff;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
    }

    .loader {
        width: 50px;
        height: 50px;
        border: 5px solid #3498db;
        border-top: 5px solid transparent;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    #mainContent {
        display: none; /* पहले से छिपाया हुआ होगा */
    }

</style>
<body>
    <div id="preloader">
        <div class="loader"></div>
    </div>

    <div id="mainContent">

    </div>
</body>

<body style="overflow-x: hidden;">
    <div class="loader-container">
        <div class="sk-bounce sk-primary">
            <div class="sk-bounce-dot"></div>
            <div class="sk-bounce-dot"></div>
        </div>
        <div class="text-white fw-bold small" id="loader_text">
            Preparing Data to Update...
        </div>
    </div>
    <!-- Layout wrapper -->
    <div class="layout-wrapper layout-content-navbar">
        <div class="layout-container">
            <!-- Menu -->
            <aside id="layout-menu" class="layout-menu menu-vertical menu bg-menu-theme">
                <div class="app-brand demo">
                    <a href="#" class="app-brand-link">
                        <img src="{{publicPath('logo.png')}}"
                            class="img-thumbnail logo-image" style="height: 50px;width:100px;object-fit:contain;">
                        <span class="app-brand-text demo menu-text fw-bold ms-2"> </span>
                    </a>
                    <a href="javascript:void(0);" class="layout-menu-toggle menu-link text-large ms-auto">
                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M11.4854 4.88844C11.0081 4.41121 10.2344 4.41121 9.75715 4.88844L4.51028 10.1353C4.03297 10.6126 4.03297 11.3865 4.51028 11.8638L9.75715 17.1107C10.2344 17.5879 11.0081 17.5879 11.4854 17.1107C11.9626 16.6334 11.9626 15.8597 11.4854 15.3824L7.96672 11.8638C7.48942 11.3865 7.48942 10.6126 7.96672 10.1353L11.4854 6.61667C11.9626 6.13943 11.9626 5.36568 11.4854 4.88844Z"
                                fill="currentColor" fill-opacity="0.6" />
                            <path
                                d="M15.8683 4.88844L10.6214 10.1353C10.1441 10.6126 10.1441 11.3865 10.6214 11.8638L15.8683 17.1107C16.3455 17.5879 17.1192 17.5879 17.5965 17.1107C18.0737 16.6334 18.0737 15.8597 17.5965 15.3824L14.0778 11.8638C13.6005 11.3865 13.6005 10.6126 14.0778 10.1353L17.5965 6.61667C18.0737 6.13943 18.0737 5.36568 17.5965 4.88844C17.1192 4.41121 16.3455 4.41121 15.8683 4.88844Z"
                                fill="currentColor" fill-opacity="0.38" />
                        </svg>
                    </a>
                </div>

                <div class="menu-inner-shadow"></div>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" integrity="sha512-M8R6twMumAK3EuvZcfHbLGbkfrGVGmEX6L8MiFfLGaKHoZoIXuG8O4lfkG5zpGjsX8mUSr3GEtmLz+jQvL7EcA==" crossorigin="anonymous" referrerpolicy="no-referrer" />

                <ul class="menu-inner py-1">
    <li class="menu-item {{ Route::is('admin.dashboard') ? 'active' : null }}">
        <a href="{{ route('admin.dashboard') }}"
           class="{{ Route::currentRouteName() == 'admin.dashboard' ? 'menu-link active' : 'menu-link' }}">
            <i class="menu-icon tf-icons fas fa-home"></i>
            <div class="menu-title">Dashboard</div>
        </a>
    </li>

    <li class="menu-item {{ in_array(Route::currentRouteName(), ['admin.student.index','admin.student.create','admin.studentFilters']) ? 'open' : '' }}">
        <a href="javascript:void(0);" class="menu-link menu-toggle">
            <i class="menu-icon tf-icons fas fa-user-graduate"></i>
            <div data-i18n="Student Information">Student Information</div>
        </a>
        <ul class="menu-sub">
            <li class="menu-item {{ Route::is('admin.student.index') ? 'active' : '' }}">
                <a href="{{ route('admin.student.index') }}"
                   class="menu-link {{ Route::is('admin.student.index') ? 'active' : '' }}">
                    <div class="menu-title"><span>Students</span></div>
                </a>
            </li>

            <li class="menu-item {{ Route::is('admin.studentFilters') ? 'active' : '' }}">
                <a href="{{ route('admin.studentFilters') }}"
                   class="menu-link {{ Route::is('admin.studentFilters') ? 'active' : '' }}">
                    <div class="menu-title"><span>Student Class Wise</span></div>
                </a>
            </li>
        </ul>
    </li>

    @php
        $classLists = \App\Utils\SelectionList::classList();
    @endphp

    <li class="menu-item {{ Route::currentRouteName() == 'admin.student.class' ? 'open' : '' }}">
        <a href="javascript:void(0);" class="menu-link menu-toggle">
            <i class="menu-icon tf-icons fas fa-chalkboard"></i>
            <div data-i18n="Class">Class</div>
        </a>
        <ul class="menu-sub">
            @foreach ($classLists as $key => $item)
                @php
                    $isActive = Route::currentRouteName() == 'admin.student.class' && request()->route('class') == $key;
                @endphp
                <li class="menu-item {{ $isActive ? 'active' : '' }}">
                    <a href="{{ route('admin.student.class', ['class' => $key]) }}" class="menu-link {{ $isActive ? 'active' : '' }}">
                        <div class="menu-title"><span>{{ $key }}</span></div>
                    </a>
                </li>
            @endforeach
        </ul>
    </li>

    <li class="menu-item {{ in_array(Route::currentRouteName(), ['admin.student.index','admin.student.create','admin.feeCollect','admin.fee.index']) ? 'open' : '' }}">
        <a href="javascript:void(0);" class="menu-link menu-toggle">
            <i class="menu-icon tf-icons fas fa-money-check-alt"></i>
            <div data-i18n="Fees Collection">Fees Collection</div>
        </a>
        <ul class="menu-sub">
            <li class="menu-item {{ Route::is('admin.feeCollect') ? 'active' : '' }}">
                <a href="{{ route('admin.feeCollect') }}"
                   class="menu-link {{ Route::is('admin.feeCollect') ? 'active' : '' }}">
                    <div class="menu-title"><span>Fee Collect</span></div>
                </a>
            </li>

            <li class="menu-item {{ Route::is('admin.studentFilters') ? 'active' : '' }}">
                <a href="{{ route('admin.studentFilters') }}"
                   class="menu-link {{ Route::is('admin.studentFilters') ? 'active' : '' }}">
                    <div class="menu-title"><span>Student Class Wise</span></div>
                </a>
            </li>

            <li class="menu-item {{ Route::is('admin.fee.index') ? 'active' : '' }}">
                <a href="{{ route('admin.fee.index') }}"
                   class="menu-link {{ Route::is('admin.fee.index') ? 'active' : '' }}">
                    <div class="menu-title"><span>Fee Master</span></div>
                </a>
            </li>
        </ul>
    </li>

    <li class="menu-item {{ Route::is('admin.classes.index') ? 'active' : null }}">
        <a href="{{ route('admin.classes.index') }}"
           class="{{ Route::currentRouteName() == 'admin.classes.index' ? 'menu-link active' : 'menu-link' }}">
            <i class="menu-icon tf-icons fas fa-layer-group"></i>
            <div class="menu-title">Sections</div>
        </a>
    </li>

</ul>


            </aside>
            <!-- / Menu -->

            <!-- Layout container -->
            <div class="layout-page">
                <!-- Navbar -->

                <nav class="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme"
                    id="layout-navbar">
                    <div class="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
                        <a class="nav-item nav-link px-0 me-xl-4" href="javascript:void(0)">
                            <i class="mdi mdi-menu mdi-24px"></i>
                        </a>
                    </div>

                    <div class="navbar-nav-right d-flex align-items-center" id="navbar-collapse">


                        <ul class="navbar-nav flex-row align-items-center ms-auto">

                            <!-- Style Switcher -->
                            <li class="nav-item me-1 me-xl-0">
                                <a class="nav-link btn btn-text-secondary rounded-pill btn-icon style-switcher-toggle hide-arrow"
                                    href="javascript:void(0);">
                                    <i class="mdi mdi-24px"></i>
                                </a>
                            </li>
                            <li class="nav-item navbar-dropdown dropdown-user dropdown">
                                <a class="nav-link dropdown-toggle hide-arrow" href="javascript:void(0);"
                                    data-bs-toggle="dropdown">
                                    <div class="avatar avatar-online">
                                        <img src="{{ route('assets-resize', ['folder' => 'admins', 'h' => 100, 'w' => 100, 'file' => auth('admin')->user()->profile_pic]) }}"
                                            alt class="w-px-40 h-auto rounded-circle" />
                                    </div>
                                </a>
                                <ul class="dropdown-menu dropdown-menu-end">
                                    <li>
                                        <a class="dropdown-item" href="#.">
                                            <div class="d-flex">
                                                <div class="flex-shrink-0 me-3">
                                                    <div class="avatar avatar-online">
                                                        <img src="{{ route('assets-resize', ['folder' => 'admins', 'h' => 100, 'w' => 100, 'file' => auth('admin')->user()->profile_pic]) }}"
                                                            alt class="w-px-40 h-auto rounded-circle" />
                                                    </div>
                                                </div>
                                                <div class="flex-grow-1">
                                                    <span class="fw-semibold d-block">{{ auth('admin')->user()->name
                                                        }}</span>
                                                    <small class="text-muted">Super Admin</small>
                                                </div>
                                            </div>
                                        </a>
                                    </li>
                                    <li>
                                        <div class="dropdown-divider"></div>
                                    </li>
                                    <li>
                                        <a class="dropdown-item" href="{{ route('admin.profile') }}">
                                            <i class="fa fa-edit me-2"></i>
                                            <span class="align-middle">Profile</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a class="dropdown-item" href="{{ route('admin.logout') }}">
                                            <i class="mdi mdi-logout me-2"></i>
                                            <span class="align-middle">Log Out</span>
                                        </a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                    <div class="navbar-search-wrapper search-input-wrapper d-none">
                        <input type="text" class="form-control search-input container-xxl border-0"
                            placeholder="Search..." aria-label="Search..." />
                        <i class="mdi mdi-close search-toggler cursor-pointer"></i>
                    </div>
                </nav>
                <!-- Content wrapper -->
                <div class="content-wrapper">
                    <!-- Content -->

                    <div class="container-fluid">
                        @if (app()->isLocal() && $errors->any())
                        {!! implode('', $errors->all('<div>:message</div>')) !!}
                        @endif
                        @yield('content')
                    </div>
                    <footer class="content-footer footer bg-footer-theme">
                        <div class="container-xxl">
                            <div
                                class="footer-container d-flex align-items-center justify-content-between py-3 flex-md-row flex-column">
                            </div>
                        </div>
                    </footer>
                    <div class="content-backdrop fade"></div>
                </div>
            </div>
        </div>
        <div class="layout-overlay layout-menu-toggle"></div>
        <div class="drag-target"></div>
    </div>
</body>
@include('common.footer')

</html>
<script>
    document.addEventListener("DOMContentLoaded", function () {
        setTimeout(() => {
            document.getElementById("preloader").style.display = "none";
            document.getElementById("mainContent").style.display = "block";
        }, 100);
    });
</script>
