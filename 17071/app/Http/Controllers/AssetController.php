<?php

namespace App\Http\Controllers;

use Illuminate\Support\Str;
use Illuminate\Support\Carbon;
use App\Http\Controllers\Controller;
use Intervention\Image\ImageManager;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Response;
use Intervention\Image\Drivers\Gd\Driver;

class AssetController extends Controller
{
    public function uploads($folder, $file = 404)
    {
        if (Storage::exists("public/$folder/" . $file)) {

            return response()->file(storage_path("app/public/$folder/" . $file));
        } else {
            return response()->file(storage_path('app/public/404.jpg'));
        }
    }
    public function assets($folder, $subfolder, $file = 404)
    {
        $path = "public/$folder/$subfolder/$file";
        if (Storage::exists($path)) {
            return response()->file(storage_path("app/$path"));
        } else {
            return response()->file(storage_path('app/public/404.jpg'));
        }
    }
    public function assetsResize($folder, $w = 'auto', $h = 'auto', $file = '404')
    {
        if (Storage::exists("public/$folder/" . $file)) {
            $imagePath = Storage::path("public/{$folder}/{$file}");
            $fileExtension = pathinfo($imagePath, PATHINFO_EXTENSION);
            if ($fileExtension == 'svg') {
                return response()->file(storage_path("app/public/{$folder}/{$file}"));
            } else {
                $manager = new ImageManager(Driver::class);
                $img = $manager->read($imagePath);
                $img->resize($w, $h);
                $encodedImage = $img->toWebp();
                return Response::make($encodedImage)->header('Content-Type', 'image/webp');
            }
        } else {
            $manager = new ImageManager(Driver::class);
            $img = $manager->read(storage_path('app/public/404.jpg'));
            $img->cover($w, $h);
            $encodedImage = $img->toWebp();
            return Response::make($encodedImage)->header('Content-Type', 'image/webp');
        }
    }

    public static function uploadImage($folder, $path, $filename)
    {
        $filename .= '.' . $path->getClientOriginalExtension();
        Storage::putFileAs("public/$folder/", $path, $filename);
        return $filename;
    }
    public static function uploadFile($folder, $path, $filename)
    {
        if ($path) {
            $filename .= '.' . $path->getClientOriginalExtension();
            Storage::putFileAs("public/$folder/", $path, $filename);
            return $filename;
        } else {
            return null;
        }
    }

    public static function uploadResize($folder, $path, $name, int $w = 2000, int $h = 1024, $resize = true, $modifyFileName = true)
    {
        $fileExt =  '.' . $path->getClientOriginalExtension();
        if ($path->getClientOriginalExtension() == 'svg') {
            $fileExt =  '.' . $path->getClientOriginalExtension();
        } else {
            $fileExt =  '.webp';
        }
        if ($modifyFileName) {
            $filename = Carbon::now()->format('d-m-y-h-i-s-') . Str::slug($name) .  $fileExt;
        } else {
            $filename = $name .  $fileExt;
        }
        if ($fileExt == '.svg') {
            Storage::put("public/{$folder}/{$filename}", file_get_contents($path));
        } else {
            $manager = new ImageManager(Driver::class);
            $img = $manager->read($path);
            if ($resize) {
                $img->scale(width: $w, height: $h);
            }
            Storage::put("public/$folder/$filename", $img->toWebp());
        }

        return $filename;
    }

}
