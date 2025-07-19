<html lang="en" class="light-style layout-navbar-fixed layout-menu-fixed" dir="ltr" data-theme="theme-default"
    data-assets-path="{{ publicPath('assets/') }}" data-template="vertical-menu-template">
@include('common.header')
<title>Login to town school</title>
<link rel="stylesheet" href="{{ publicPath('assets/vendor/css/pages/page-auth.css') }}" />

<body style="overflow-x: hidden">
    <div class="position-relative">
        <div class="authentication-wrapper authentication-basic container-p-y">
            <div class="authentication-inner py-4">
                <div class="card p-2 background-overlay"
                    style="background-image: url({{ route('assets', ['folder' => 'assets', 'subfolder' => 'background', 'file' => 'login.jpg']) }});">
                    <div class="card-body mt-2">
                        <div class="d-flex justify-content-center">
                            <img class="shadow-lg" src="{{publicPath('logo.png')}}"
                                height="100px" style="border: 1px solid rgba(160, 35, 255, 0.933)">
                        </div>
                        <br>
                        <form id="formAuthentication" class="mb-3" action="{{ route('admin.login') }}" method="POST">
                            <x-input name="email" value="{{ old('email') }}" />
                            <div class="my-3">
                                <div class="form-password-toggle position-relative"
                                    style="position: relative !important;">
                                    <x-password name="password" value="{{ old('password') }}" />
                                    <div style="position: absolute !important;top:28;right:15;">
                                        <i class="mdi mdi-eye-off-outline"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="mb-3 d-flex justify-content-between">
                                <x-checkbox name="remember" label="Remember Me" checked="{{ old('remember') }}"
                                    value="1" />
                                {{--  <a href="auth-forgot-password-basic.html" class="float-end mb-1">
                                <span>Forgot Password?</span>
                            </a>  --}}
                            </div>
                            @csrf
                            <div class="mb-3">
                                <button class="btn btn-primary d-grid w-100" type="submit">Sign in</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    @include('common.footer')
