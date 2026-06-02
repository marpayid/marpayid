
"use client"

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Plus, Edit3, Trash2, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { collection, doc, setDoc, deleteDoc, addDoc, query, orderBy } from 'firebase/firestore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export default function AddressPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    province: '',
    city: '',
    district: '',
    fullAddress: '',
    notes: '',
  });

  const addressRef = useMemo(() => {
    if (!db || !user?.uid) return null;
    return collection(db, 'users', user.uid, 'addresses');
  }, [db, user?.uid]);

  const { data: addresses, loading: dataLoading } = useCollection(
    addressRef ? query(addressRef) : null
  );

  if (!authLoading && !user) {
    router.push('/login');
    return null;
  }

  const handleSaveAddress = async () => {
    if (!formData.name || !formData.phone || !formData.province || !formData.city || !formData.district || !formData.fullAddress) {
      toast({ variant: "destructive", title: "Gagal", description: "Mohon lengkapi semua bidang." });
      return;
    }

    if (!addressRef) return;

    setIsSubmitting(true);
    try {
      if (editId) {
        await setDoc(doc(db, 'users', user!.uid, 'addresses', editId), { ...formData, updatedAt: new Date() }, { merge: true });
      } else {
        await addDoc(addressRef, { ...formData, createdAt: new Date(), isPrimary: (addresses?.length === 0) });
      }
      
      toast({ variant: "success", title: "Berhasil", description: "Alamat telah disimpan." });
      setIsModalOpen(false);
      resetForm();
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Gagal menyimpan alamat." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'addresses', id));
      toast({ variant: "success", title: "Berhasil", description: "Alamat dihapus." });
    } catch (e) {
      toast({ variant: "destructive", title: "Error", description: "Gagal menghapus alamat." });
    }
  };

  const handleEdit = (addr: any, id: string) => {
    setFormData({
      name: addr.name,
      phone: addr.phone,
      province: addr.province,
      city: addr.city,
      district: addr.district,
      fullAddress: addr.fullAddress,
      notes: addr.notes || '',
    });
    setEditId(id);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({ name: '', phone: '', province: '', city: '', district: '', fullAddress: '', notes: '' });
    setEditId(null);
  };

  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white px-4 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold">Alamat Pengiriman</h1>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-primary"
          onClick={() => { resetForm(); setIsModalOpen(true); }}
        >
          <Plus className="w-5 h-5" />
        </Button>
      </header>

      <main className="pt-20 px-4 space-y-4">
        {addresses && addresses.length > 0 ? (
          addresses.map((addr: any) => (
            <div key={addr.id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {addr.isPrimary && <span className="bg-primary/10 text-primary text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest">Utama</span>}
                  <h3 className="text-sm font-bold text-gray-900">{addr.name}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleEdit(addr, addr.id)} className="p-2 text-gray-400 hover:text-primary transition-colors">
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(addr.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-gray-400">{addr.phone}</p>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {addr.fullAddress}, {addr.district}, {addr.city}, {addr.province}
                </p>
                {addr.notes && (
                  <p className="text-[10px] text-primary font-medium bg-primary/5 inline-block px-2 py-0.5 rounded mt-2">
                    Catatan: {addr.notes}
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center opacity-40">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
              <MapPin className="w-10 h-10" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Belum ada alamat tersimpan</h3>
            <p className="text-[10px] font-medium text-gray-500 mt-1 max-w-[200px]">
              Tambahkan alamat pengiriman untuk memudahkan proses checkout.
            </p>
            <Button onClick={() => setIsModalOpen(true)} className="mt-6 bg-primary text-white rounded-2xl px-8 h-12 font-bold">
              + Tambah Alamat
            </Button>
          </div>
        )}
      </main>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">{editId ? 'Edit Alamat' : 'Tambah Alamat'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-gray-700">Nama Penerima</Label>
              <Input 
                placeholder="Nama Lengkap" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="rounded-xl border-gray-200"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-gray-700">Nomor HP</Label>
              <Input 
                placeholder="08xxxxxxxxxx" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="rounded-xl border-gray-200"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-gray-700">Provinsi</Label>
                <Input 
                  placeholder="Provinsi" 
                  value={formData.province}
                  onChange={(e) => setFormData({...formData, province: e.target.value})}
                  className="rounded-xl border-gray-200"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-gray-700">Kota/Kabupaten</Label>
                <Input 
                  placeholder="Kota/Kab" 
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="rounded-xl border-gray-200"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-gray-700">Kecamatan</Label>
              <Input 
                placeholder="Kecamatan" 
                value={formData.district}
                onChange={(e) => setFormData({...formData, district: e.target.value})}
                className="rounded-xl border-gray-200"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-gray-700">Alamat Lengkap</Label>
              <Textarea 
                placeholder="Jl. Nama Jalan, No Rumah, RT/RW" 
                value={formData.fullAddress}
                onChange={(e) => setFormData({...formData, fullAddress: e.target.value})}
                className="rounded-xl border-gray-200"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-gray-700">Catatan (Opsional)</Label>
              <Input 
                placeholder="Pagar warna hijau / depan pos" 
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="rounded-xl border-gray-200"
              />
            </div>
          </div>
          <DialogFooter>
            <Button disabled={isSubmitting} onClick={handleSaveAddress} className="w-full bg-primary text-white font-bold h-12 rounded-xl shadow-lg shadow-primary/20">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Simpan Alamat'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
