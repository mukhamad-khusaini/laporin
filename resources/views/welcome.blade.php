<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>{{ config('app.name', 'Laravel') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

    <!-- Styles / Scripts -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])


<body class="w-screen flex bg-gray-100">
    <!-- Header -->
    <header class="w-full h-16 bg-white flex items-center justify-between px-6 shadow-md border-b border-gray-200 fixed">
        <!-- Nama Usaha -->
        <h1 class="text-xl font-bold text-gray-800">Nama Usaha Anda</h1>

        <!-- Profil -->
        <div class="flex items-center space-x-4">
            <img src="https://via.placeholder.com/40" alt="Profil"
                class="w-10 h-10 rounded-full object-cover border border-gray-300" />
            <span class="text-gray-700 font-medium">Mukhamad</span>
        </div>
    </header>
    <!-- Sidebar -->
    <aside class="w-[20vw] bg-gray-800 p-4 flex flex-col space-y-4 mt-16">
        <button class="text-white bg-gray-800 hover:bg-gray-600 py-2 px-4 rounded">Template</button>
        <button class="text-white bg-gray-800 hover:bg-gray-600 py-2 px-4 rounded">Template</button>
        <button class="text-white bg-gray-800 hover:bg-gray-600 py-2 px-4 rounded">Template</button>
        <button class="text-white bg-gray-800 hover:bg-gray-600 py-2 px-4 rounded">Template</button>
        <button class="text-white bg-gray-800 hover:bg-gray-600 py-2 px-4 rounded">Template</button>
    </aside>

    <!-- Dashboard -->
    <main class="w-[80vw] mt-16">
        <div class="bg-white px-6 py-4">
            <h2 class="text-4xl font-bold">Dashboard</h2>
        </div>
        <div class=" bg-white px-6 py-3 flex flex-wrap gap-6 content-start">
            <div class="w-[20rem] h-[20rem] border border-black rounded-[10px] shadow-md p-4">
                <h2 class="text-lg font-semibold">Lorem ipsum</h2>
            </div>
            <div class="w-[20rem] h-[20rem] border border-black rounded-[10px] shadow-md p-4">
                <h2 class="text-lg font-semibold">Lorem ipsum</h2>
            </div>
            <div class="w-[20rem] h-[20rem] border border-black rounded-[10px] shadow-md p-4">
                <h2 class="text-lg font-semibold">Lorem ipsum</h2>
            </div>
            <div class="w-[17rem] h-[10rem] border border-black rounded-[10px] shadow-md p-4">
                <h2 class="text-lg font-semibold">Lorem ipsum</h2>
            </div>
            <div class="w-[10rem] h-[10rem] border border-black rounded-[10px] shadow-md p-4">
                <h2 class="text-lg font-semibold">Lorem ipsum</h2>
            </div>
        </div>

    </main>
</body>


</html>
