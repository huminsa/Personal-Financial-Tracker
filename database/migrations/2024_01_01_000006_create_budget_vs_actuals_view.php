<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement("CREATE VIEW budget_vs_actuals AS
            SELECT 
                b.user_id,
                b.category_id,
                b.month,
                b.year,
                b.amount as budget_amount,
                COALESCE(SUM(t.amount), 0) as actual_amount,
                (b.amount - COALESCE(SUM(t.amount), 0)) as difference,
                CASE 
                    WHEN COALESCE(SUM(t.amount), 0) > b.amount THEN 'over_budget'
                    WHEN COALESCE(SUM(t.amount), 0) = b.amount THEN 'on_budget'
                    ELSE 'under_budget'
                END as status
            FROM budgets b
            LEFT JOIN transactions t ON 
                t.user_id = b.user_id 
                AND t.category_id = b.category_id 
                AND MONTH(t.transaction_date) = b.month 
                AND YEAR(t.transaction_date) = b.year
                AND t.type = 'expense'
            GROUP BY b.id, b.user_id, b.category_id, b.month, b.year, b.amount");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('DROP VIEW IF EXISTS budget_vs_actuals');
    }
};
