<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class CategoryController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Category::where('user_id', auth()->id())
            ->orWhere('is_default', true)
            ->withCount('transactions');

        // Filter by type jika ada
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        $categories = $query->orderBy('type')
            ->orderBy('order')
            ->orderBy('name')
            ->get();

        return Inertia::render('Categories/Index', [
            'categories' => $categories,
            'filters' => $request->only(['type'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Categories/Create', [
            'categoryTypes' => ['income', 'expense', 'transfer']
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:income,expense,transfer',
            'color' => 'required|string|max:7',
            'icon' => 'required|string|max:255',
        ]);

        // Cek duplikasi
        $existing = Category::where('user_id', auth()->id())
            ->where('name', $request->name)
            ->where('type', $request->type)
            ->first();

        if ($existing) {
            return back()->withErrors(['name' => 'Kategori dengan nama dan tipe ini sudah ada.']);
        }

        Category::create([
            'user_id' => auth()->id(),
            'name' => $request->name,
            'type' => $request->type,
            'color' => $request->color,
            'icon' => $request->icon,
            'order' => Category::where('user_id', auth()->id())->max('order') + 1,
        ]);

        return redirect()->route('categories.index')
            ->with('success', 'Kategori berhasil dibuat!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        // pastikan policy/view sudah terdaftar; authorize akan memeriksa permissions
        $this->authorize('view', $category);

        $transactions = $category->transactions()
            ->with(['fromAccount', 'toAccount'])
            ->orderBy('transaction_date', 'desc')
            ->paginate(10);

        return Inertia::render('Categories/Show', [
            'category' => $category,
            'transactions' => $transactions,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category)
    {
        $this->authorize('update', $category);

        return Inertia::render('Categories/Edit', [
            'category' => $category,
            'categoryTypes' => ['income', 'expense', 'transfer']
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category)
    {
        $this->authorize('update', $category);

        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:income,expense,transfer',
            'color' => 'required|string|max:7',
            'icon' => 'required|string|max:255',
        ]);

        // Cek duplikasi (kecuali diri sendiri)
        $existing = Category::where('user_id', auth()->id())
            ->where('name', $request->name)
            ->where('type', $request->type)
            ->where('id', '!=', $category->id)
            ->first();

        if ($existing) {
            return back()->withErrors(['name' => 'Kategori dengan nama dan tipe ini sudah ada.']);
        }

        $category->update($request->only(['name', 'type', 'color', 'icon']));

        return redirect()->route('categories.index')
            ->with('success', 'Kategori berhasil diperbarui!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        $this->authorize('delete', $category);

        // Cek apakah kategori punya transactions
        if ($category->transactions()->exists()) {
            return back()->with('error', 'Tidak dapat menghapus kategori yang memiliki transaksi.');
        }

        $category->delete();

        return redirect()->route('categories.index')
            ->with('success', 'Kategori berhasil dihapus!');
    }

    /**
     * Reorder categories
     */
    public function reorder(Request $request)
    {
        $request->validate([
            'categories' => 'required|array',
            'categories.*.id' => 'required|exists:categories,id',
            'categories.*.order' => 'required|integer'
        ]);

        foreach ($request->categories as $item) {
            Category::where('id', $item['id'])
                ->where('user_id', auth()->id())
                ->update(['order' => $item['order']]);
        }

        return response()->json(['message' => 'Urutan kategori berhasil diperbarui!']);
    }
};