import { useState, useEffect } from "react";
import { FiPlus, FiClock, FiTarget, FiSearch, FiGrid, FiList } from "react-icons/fi";
import type { PdiCycle } from "../../types/pdi";
import { CreateCycleModal } from "./CreateCycleModal";
import { CycleCard } from "./CycleCard";

interface CyclesManagerProps {
  cycles: PdiCycle[];
  onCreateCycle: (cycle: Omit<PdiCycle, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateCycle: (cycleId: string, cycle: Partial<PdiCycle>) => void;
  onDeleteCycle: (cycleId: string) => void;
  onSelectCycle: (cycleId: string) => void;
  selectedCycleId?: string;
  editing: boolean;
}

export function CyclesManager({
  cycles,
  onCreateCycle,
  onUpdateCycle,
  onDeleteCycle,
  onSelectCycle,
  selectedCycleId,
  editing,
}: CyclesManagerProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'planned' | 'completed'>('all');

  // Filtrar ciclos baseado na busca e filtro de status
  const filteredCycles = cycles.filter(cycle => {
    const matchesSearch = cycle.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cycle.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    
    const matchesStatus = filterStatus === 'all' || cycle.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const activeCycle = filteredCycles.find(c => c.status === 'active');
  const plannedCycles = filteredCycles.filter(c => c.status === 'planned');
  const completedCycles = filteredCycles.filter(c => c.status === 'completed');

  const handleCreateCycle = (cycleData: Omit<PdiCycle, 'id' | 'createdAt' | 'updatedAt'>) => {
    onCreateCycle(cycleData);
    setShowCreateModal(false);
  };

  // Atalhos de teclado para facilitar o gerenciamento
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + N para criar novo ciclo
      if ((e.ctrlKey || e.metaKey) && e.key === 'n' && editing) {
        e.preventDefault();
        setShowCreateModal(true);
      }
      
      // Ctrl/Cmd + F para focar na busca
      if ((e.ctrlKey || e.metaKey) && e.key === 'f' && cycles.length > 0) {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder="Buscar ciclos..."]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
          searchInput.select();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [editing, cycles.length]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <FiTarget className="w-5 h-5 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-900">Ciclos de PDI</h2>
          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
            {cycles.length} {cycles.length === 1 ? 'ciclo' : 'ciclos'}
          </span>
          {editing && (
            <div className="hidden lg:flex items-center gap-2 text-xs text-gray-400">
              <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-xs">Ctrl+N</kbd>
              <span>novo ciclo</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {/* Botão principal sempre visível */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm hover:shadow-md"
          >
            <FiPlus className="w-4 h-4" />
            Novo Ciclo
          </button>
          
          {cycles.length > 0 && (
            <>
              {/* Busca */}
              <div className="relative group">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar ciclos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-16 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 opacity-50 group-focus-within:opacity-100">
                  <kbd className="px-1 py-0.5 text-xs bg-gray-100 border border-gray-200 rounded">Ctrl+F</kbd>
                </div>
              </div>

              {/* Filtro de Status */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">Todos</option>
                <option value="active">Ativos</option>
                <option value="planned">Planejados</option>
                <option value="completed">Concluídos</option>
              </select>

              {/* Modo de Visualização */}
              <div className="flex border border-gray-200 rounded-lg">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' 
                    ? 'bg-indigo-100 text-indigo-600' 
                    : 'text-gray-400 hover:text-gray-600'
                  } transition-colors`}
                  title="Visualização em lista"
                >
                  <FiList className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' 
                    ? 'bg-indigo-100 text-indigo-600' 
                    : 'text-gray-400 hover:text-gray-600'
                  } transition-colors`}
                  title="Visualização em grade"
                >
                  <FiGrid className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Resultados de busca quando há filtro */}
      {(searchTerm || filterStatus !== 'all') && (
        <div className="text-sm text-gray-500">
          {filteredCycles.length === 0 
            ? "Nenhum ciclo encontrado com os filtros aplicados"
            : `${filteredCycles.length} ${filteredCycles.length === 1 ? 'ciclo encontrado' : 'ciclos encontrados'}`
          }
        </div>
      )}

      {/* Container de ciclos com layout responsivo */}
      <div className={viewMode === 'grid' 
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" 
        : "space-y-6"
      }>
        {/* Ciclo Ativo */}
        {activeCycle && (
          <div className={viewMode === 'list' ? "space-y-3" : ""}>
            {viewMode === 'list' && (
              <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Ciclo Ativo
              </h3>
            )}
            <CycleCard
              cycle={activeCycle}
              isSelected={selectedCycleId === activeCycle.id}
              onSelect={() => onSelectCycle(activeCycle.id)}
              onUpdate={onUpdateCycle}
              onDelete={onDeleteCycle}
              editing={editing}
            />
          </div>
        )}

        {/* Ciclos Planejados */}
        {plannedCycles.length > 0 && (
          <div className={viewMode === 'list' ? "space-y-3" : "contents"}>
            {viewMode === 'list' && (
              <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <FiClock className="w-4 h-4 text-blue-500" />
                Ciclos Planejados ({plannedCycles.length})
              </h3>
            )}
            <div className={viewMode === 'list' ? "space-y-2" : "contents"}>
              {plannedCycles.map((cycle) => (
                <CycleCard
                  key={cycle.id}
                  cycle={cycle}
                  isSelected={selectedCycleId === cycle.id}
                  onSelect={() => onSelectCycle(cycle.id)}
                  onUpdate={onUpdateCycle}
                  onDelete={onDeleteCycle}
                  editing={editing}
                />
              ))}
            </div>
          </div>
        )}

        {/* Ciclos Concluídos */}
        {completedCycles.length > 0 && (
          <div className={viewMode === 'list' ? "space-y-3" : "contents"}>
            {viewMode === 'list' && (
              <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                Ciclos Concluídos ({completedCycles.length})
              </h3>
            )}
            <div className={viewMode === 'list' ? "space-y-2" : "contents"}>
              {completedCycles.map((cycle) => (
                <CycleCard
                  key={cycle.id}
                  cycle={cycle}
                  isSelected={selectedCycleId === cycle.id}
                  onSelect={() => onSelectCycle(cycle.id)}
                  onUpdate={onUpdateCycle}
                  onDelete={onDeleteCycle}
                  editing={editing}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Dica para usuários com ciclos */}
      {cycles.length === 1 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
              <FiTarget className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-sm">
              <p className="text-blue-800 font-medium mb-1">💡 Dica: Gerenciar Ciclos</p>
              <p className="text-blue-700">
                Passe o mouse sobre um ciclo para ver os botões de <strong>editar</strong> e <strong>excluir</strong>. 
                Ou clique em "Novo Ciclo" para criar mais ciclos de desenvolvimento.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Estados vazios */}
      {cycles.length === 0 && (
        <div className="text-center py-12 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border-2 border-dashed border-indigo-200">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiTarget className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Organize seu desenvolvimento</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Crie ciclos para organizar seu PDI por períodos específicos. Cada ciclo pode ter metas, 
            competências e marcos únicos.
          </p>
          
          {/* Benefícios dos ciclos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <FiClock className="w-5 h-5 text-indigo-600" />
              </div>
              <h4 className="font-medium text-gray-900 text-sm">Gestão Temporal</h4>
              <p className="text-xs text-gray-500">Organize por trimestres, semestres ou períodos customizados</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <FiTarget className="w-5 h-5 text-indigo-600" />
              </div>
              <h4 className="font-medium text-gray-900 text-sm">Foco Direcionado</h4>
              <p className="text-xs text-gray-500">Defina objetivos específicos para cada período</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <FiGrid className="w-5 h-5 text-indigo-600" />
              </div>
              <h4 className="font-medium text-gray-900 text-sm">Histórico Organizado</h4>
              <p className="text-xs text-gray-500">Mantenha registro de sua evolução ao longo do tempo</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 rounded-xl transition-all transform hover:scale-105 shadow-lg"
            >
              <FiPlus className="w-5 h-5" />
              Criar Primeiro Ciclo
            </button>
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-6 py-4 text-sm font-medium text-gray-700 bg-white border-2 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 rounded-xl transition-all"
            >
              Ver Templates
            </button>
          </div>
        </div>
      )}

      {/* Estado quando a busca não retorna resultados */}
      {cycles.length > 0 && filteredCycles.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <FiSearch className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum ciclo encontrado</h3>
          <p className="text-gray-500 mb-6">
            Tente ajustar os filtros ou o termo de busca para encontrar seus ciclos.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setSearchTerm("")}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Limpar busca
            </button>
            <button
              onClick={() => setFilterStatus('all')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Mostrar todos
            </button>
          </div>
        </div>
      )}

      {/* Botão de ação rápida flutuante - aparece quando há poucos ciclos */}
      {cycles.length > 0 && cycles.length < 5 && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border-2 border-dashed border-indigo-300 hover:border-indigo-400 rounded-xl transition-all hover:scale-105"
          >
            <FiPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Adicionar Outro Ciclo</span>
            <span className="sm:hidden">Novo Ciclo</span>
          </button>
        </div>
      )}

      {/* Modal de criação */}
      {showCreateModal && (
        <CreateCycleModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateCycle}
        />
      )}
    </div>
  );
}