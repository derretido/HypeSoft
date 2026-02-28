import React, { useEffect, useState } from 'react';
import { api } from './services/api';
import { 
  Package, AlertCircle, LayoutDashboard, PlusCircle, X, 
  Loader2, Trash2, Edit3, Search, Tag, 
  Boxes, ChevronDown, ChevronUp, Filter, LogOut, TrendingUp, Lock
} from 'lucide-react';

function App({ keycloak }: { keycloak: any }) {
  // --- VERIFICAÇÃO DE PERMISSÕES ---
  const isAdmin = keycloak.hasResourceRole('admin') || keycloak.hasRealmRole('admin');

  const [allProducts, setAllProducts] = useState<any[]>([]); 
  const [categories, setCategories] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const [newProduct, setNewProduct] = useState({ 
    name: '', description: '', stockQuantity: 0, price: 0, categoryId: '' 
  });

  const handleLogout = () => keycloak.logout({ redirectUri: window.location.origin });

  const filteredProducts = allProducts.filter(product => {
    const name = (product.name || product.Name || '').toLowerCase();
    const matchesName = name.includes(searchTerm.toLowerCase());
    const productCatId = product.categoryId || product.CategoryId || '';
    return matchesName && (selectedCategory === '' || productCatId === selectedCategory);
  });

  const totalLowStock = allProducts.filter(p => (p.stockQuantity ?? p.StockQuantity ?? 0) < 10).length;
  
  const totalStockValue = allProducts.reduce((acc, p) => {
    const qty = p.stockQuantity ?? p.StockQuantity ?? 0;
    const price = p.price ?? p.Price ?? 0;
    return acc + (qty * price);
  }, 0);

  const categoryStats = categories.map(cat => {
    const catId = cat.id || cat.Id;
    const count = allProducts.filter(p => (p.categoryId || p.CategoryId) === catId).length;
    const percentage = allProducts.length > 0 ? (count / allProducts.length) * 100 : 0;
    return { name: cat.name || cat.Name, count, percentage };
  }).sort((a, b) => b.count - a.count);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        api.get('/Products'),
        api.get('/Categories')
      ]);
      setAllProducts(prodRes.data);
      setCategories(catRes.data);
    } catch (err) { console.error("Erro ao carregar:", err); } finally { setLoading(false); }
  };

  useEffect(() => { loadInitialData(); }, []);

  const toggleExpand = (id: string) => setExpandedProductId(expandedProductId === id ? null : id);

  const handleEditClick = (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    if (!isAdmin) return; // Bloqueio extra
    const id = product.id || product.Id;
    setEditingId(id);
    setNewProduct({
      name: product.name || product.Name,
      description: product.description || product.Description,
      stockQuantity: product.stockQuantity ?? product.StockQuantity ?? 0,
      price: product.price ?? product.Price ?? 0,
      categoryId: product.categoryId || product.CategoryId || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    
    setIsSubmitting(true);
    const command = { 
      Id: editingId, 
      Name: newProduct.name, 
      Description: newProduct.description,
      StockQuantity: Number(newProduct.stockQuantity), 
      Price: Number(newProduct.price), 
      CategoryId: newProduct.categoryId 
    };

    try {
      editingId ? await api.put(`/Products/${editingId}`, command) : await api.post('/Products', command);
      closeModal();
      await loadInitialData();
    } catch (err) { 
      alert("Erro ao salvar. Verifique se sua conta tem permissão de escrita."); 
    } finally { setIsSubmitting(false); }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!isAdmin) return;
    if (window.confirm("Deseja excluir este produto permanentemente?")) {
      try { await api.delete(`/Products/${id}`); await loadInitialData(); } catch (err) { console.error(err); }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setNewProduct({ name: '', description: '', stockQuantity: 0, price: 0, categoryId: '' });
  };

  const handleCreateCategory = async () => {
    if (!isAdmin) return;
    const name = prompt("Nome da nova categoria:");
    if (!name) return;
    try {
      await api.post('/Categories', JSON.stringify(name), { headers: { 'Content-Type': 'application/json' } });
      await loadInitialData();
    } catch (err) { alert("Erro ao criar categoria."); }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* NAVBAR */}
      <nav className="bg-white border-b border-slate-200 p-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 font-bold text-xl">
              <LayoutDashboard className="text-blue-600" /> 
              <span>Hypesoft <span className="text-blue-600 underline">Inv</span></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden md:inline-block text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-bold uppercase tracking-tight">
                {keycloak.tokenParsed?.preferred_username}
              </span>
              <span className={`text-[10px] px-2 py-1 rounded-md font-black uppercase ${isAdmin ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                {isAdmin ? 'ADMIN' : 'VIEWER'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* BOTÃO NOVO PRODUTO: Apenas para Admin */}
            {isAdmin && (
              <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-md font-bold text-sm uppercase">
                <PlusCircle size={18} /> Novo Produto
              </button>
            )}
            <button onClick={handleLogout} className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" title="Sair"><LogOut size={22} /></button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-8">
        {/* DASHBOARD CARDS - Visível para ambos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-xl text-blue-600"><Package size={24}/></div>
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase">Total Itens</p>
              <h2 className="text-2xl font-black">{allProducts.length}</h2>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600"><TrendingUp size={24}/></div>
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase">Valor Estoque</p>
              <h2 className="text-2xl font-black text-emerald-600">R$ {totalStockValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="bg-amber-100 p-3 rounded-xl text-amber-600"><AlertCircle size={24}/></div>
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase">Em Alerta</p>
              <h2 className="text-2xl font-black text-amber-600">{totalLowStock}</h2>
            </div>
          </div>
        </div>

        {/* GRÁFICO - Visível para ambos */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm mb-10">
          <div className="flex items-center gap-2 mb-6 border-b border-slate-50 pb-4">
            <div className="bg-indigo-50 p-2 rounded-lg"><Boxes size={20} className="text-indigo-600" /></div>
            <h3 className="font-black text-slate-800 uppercase tracking-wider text-sm">Distribuição por Categoria</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-6">
            {categoryStats.map((stat, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-500 uppercase">{stat.name}</span>
                  <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">{stat.count} un</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full transition-all duration-1000" style={{ width: `${stat.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BUSCA */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full text-slate-400 focus-within:text-blue-600 transition-colors">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2" size={20} />
            <input type="text" placeholder="Pesquisar produto pelo nome..." className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-slate-700"
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="relative w-full md:w-64">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <select className="w-full pl-11 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-slate-600 font-medium cursor-pointer shadow-sm"
              value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="">Todas Categorias</option>
              {categories.map((cat: any) => (<option key={cat.id || cat.Id} value={cat.id || cat.Id}>{cat.name || cat.Name}</option>))}
            </select>
          </div>
        </div>

        {/* TABELA - Com botões condicionais */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
                <thead>
                   <tr className="text-slate-400 text-xs uppercase font-bold border-b border-slate-100 bg-slate-50/50">
                      <th className="px-6 py-5">Produto</th>
                      <th className="px-6 py-5">Categoria</th>
                      <th className="px-6 py-5">Preço</th>
                      <th className="px-6 py-5">Estoque</th>
                      <th className="px-6 py-5 text-center">Ações</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                   {filteredProducts.map((item: any) => {
                     const id = item.id || item.Id;
                     const isExpanded = expandedProductId === id;
                     const cat = categories.find(c => (c.id || c.Id) === (item.categoryId || item.CategoryId));
                     const stock = item.stockQuantity ?? item.StockQuantity ?? 0;
                     
                     return (
                      <React.Fragment key={id}>
                        <tr onClick={() => toggleExpand(id)} className={`group cursor-pointer transition-all ${isExpanded ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <div className={`p-1 rounded-md transition-colors ${isExpanded ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}`}>
                                  {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                </div>
                                <span className="font-bold text-slate-700">{item.name || item.Name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-[10px] bg-white border border-slate-200 text-slate-500 px-2 py-1 rounded-md flex items-center gap-1 w-fit font-bold uppercase">
                                <Tag size={10}/> {cat ? (cat.name || cat.Name) : 'Geral'}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-medium text-slate-600">R$ {(item.price || item.Price || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1.5 font-bold ${stock < 10 ? 'text-red-500' : 'text-slate-700'}`}>
                                {stock < 10 && <AlertCircle size={14} />} {stock} un
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              {isAdmin ? (
                                <div className="flex justify-center gap-1">
                                   <button onClick={(e) => handleEditClick(e, item)} className="p-2 text-blue-500 hover:bg-blue-100 rounded-xl transition-all" title="Editar"><Edit3 size={18} /></button>
                                   <button onClick={(e) => handleDelete(e, id)} className="p-2 text-red-500 hover:bg-red-100 rounded-xl transition-all" title="Excluir"><Trash2 size={18} /></button>
                                </div>
                              ) : (
                                <div className="flex justify-center text-slate-300" title="Apenas visualização">
                                  <Lock size={16} />
                                </div>
                              )}
                            </td>
                        </tr>
                        {isExpanded && (
                          <tr className="bg-blue-50/30 text-slate-600">
                            <td colSpan={5} className="px-12 py-5 border-l-4 border-blue-500">
                                <p className="text-sm max-w-2xl leading-relaxed italic">{item.description || item.Description || "Sem descrição."}</p>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                   )})}
                </tbody>
             </table>
           </div>
        </div>
      </main>

      {/* MODAL - Protegido (só abre para admin) */}
      {isModalOpen && isAdmin && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl scale-in-center">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-slate-800">{editingId ? 'Editar Produto' : 'Novo Produto'}</h2>
              <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Nome</label>
                <input required className="w-full border border-slate-200 p-3.5 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Categoria</label>
                <div className="flex gap-2">
                  <select required className="flex-1 border border-slate-200 p-3.5 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500 appearance-none text-slate-700"
                    value={newProduct.categoryId} onChange={e => setNewProduct({...newProduct, categoryId: e.target.value})}>
                    <option value="">Selecione...</option>
                    {categories.map((cat: any) => (<option key={cat.id || cat.Id} value={cat.id || cat.Id}>{cat.name || cat.Name}</option>))}
                  </select>
                  <button type="button" onClick={handleCreateCategory} className="p-3.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"><PlusCircle size={22} /></button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Descrição</label>
                <textarea required className="w-full border border-slate-200 p-3.5 rounded-xl bg-slate-50 h-24 outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                  value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Estoque</label>
                  <input type="number" min="0" required className="w-full border border-slate-200 p-3.5 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500"
                    value={newProduct.stockQuantity} onChange={e => setNewProduct({...newProduct, stockQuantity: Number(e.target.value)})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Preço</label>
                  <input type="number" step="0.01" min="0" required className="w-full border border-slate-200 p-3.5 rounded-xl bg-slate-50 outline-none focus:ring-2 focus:ring-blue-500"
                    value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})} />
                </div>
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black shadow-lg transition-all flex items-center justify-center gap-2 mt-4">
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'SALVAR ALTERAÇÕES'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;