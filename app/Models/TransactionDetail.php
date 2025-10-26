<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Models\TransactionHeader;

class TransactionDetail extends Model
{
    use HasFactory;

    protected $fillable = ['transaction_header_id', 'account_id', 'debit', 'credit', 'sub_ledger_id'];

    public static function getPembelianKredit()
    {
        return Self::with([
            'account',
            'subLedger',
            'transactionHeader.details.subLedger', // preload semua detail untuk akses vendor
        ])
        ->whereHas('transactionHeader', function ($q) {
            $q->where('transaction_category', 'pembelian.kredit');
        })
        ->where('debit', '>', 0) // hanya ambil akun pembelian
        ->orderByDesc('transaction_header_id')
        ->get()
        ->map(function ($detail) {
            // Cari detail lain dalam transaksi yang sama yang posisinya kredit
            $vendorDetail = $detail->transactionHeader->details
                ->where('credit', '>', 0)
                ->first();

            return [
                'id'=> $detail->transactionHeader->id,
                'transaction_date' => $detail->transactionHeader->transaction_date->format('Y-m-d\TH:i'),
                'sub_ledger' => $detail->subLedger->name ?? '-',
                'total' => floatval($detail->debit),
                'vendor' => $vendorDetail?->subLedger?->name ?? '-',
                'account_type' => $detail->account->name ?? '-',
                'description' => $detail->transactionHeader->description ?? "",
            ];
        });
    }

    public static function getPembelianTunai()
    {
        return Self::with([
            'account',
            'subLedger',
            'transactionHeader.details.subLedger', // preload semua detail untuk akses vendor
        ])
        ->whereHas('transactionHeader', function ($q) {
            $q->where('transaction_category', 'pembelian.tunai');
        })
        ->where('debit', '>', 0) // hanya ambil akun pembelian
        ->orderByDesc('transaction_header_id')
        ->get()
        ->map(function ($detail) {
            // Cari detail lain dalam transaksi yang sama yang posisinya kredit
            $sourceDetail = $detail->transactionHeader->details
                ->where('credit', '>', 0)
                ->first();

            return [
                'id'=> $detail->transactionHeader->id,
                'transaction_date' => $detail->transactionHeader->transaction_date->format('Y-m-d\TH:i'),
                'sub_ledger' => $detail->subLedger->name ?? '-',
                'total' => floatval($detail->debit),
                'source' => $sourceDetail?->subLedger?->name ?? '-',
                'account_type' => $detail->account->name ?? '-',
                'description' => $detail->transactionHeader->description ?? "",
            ];
        });
    }

    public static function getPenjualanKredit()
    {   
        // Ambil semua detail yang terkait dengan transaksi penjualan kredit
        $headers = TransactionHeader::with(['details.account', 'details.subLedger'])
            ->where('transaction_category', 'penjualan.kredit')
            ->get();

        return $headers->map(function ($header) {
            // Ambil detail yang posisi kredit → barang/jasa yang dijual
            $kredit = $header->details->firstWhere('credit', '>', 0);
            // Ambil detail yang posisi debit → piutang
            $debit = $header->details->firstWhere('debit', '>', 0);

            return [
                'transaction_date' => $header->transaction_date,
                'account_type'     => $kredit?->account->name ?? '-',
                'sub_ledger'       => $kredit?->subLedger->name ?? '-',
                'description'      => $header->description ?? '-',
                'amount'           => $kredit?->credit ?? 0,
                'piutang'          => $debit?->subLedger->name ?? '-',
            ];
        });

    }

    public function transactionHeader(): BelongsTo
    {
        return $this->belongsTo(TransactionHeader::class, 'transaction_header_id');
    }

    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class);
    }

    public function subLedger()
    {
        return $this->belongsTo(SubLedger::class);
    }
}
