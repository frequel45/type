import{ useState } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
} from 'reactflow';
import 'reactflow/dist/style.css';
import './components/styles.css';
import Sidebar from './components/Sidebar.tsx';
import DetailSidebar from './components/DetailSidebar.tsx';
import { useMealsAPI } from './hooks/useMealsAPI.ts';
import NodeComponent from './components/NodeComponent.tsx';

// Define custom node types
const nodeTypes = {
  customNode: NodeComponent,
};

// Define types for category and meal
interface Category {
  strCategory: string;
}

interface Meal {
  idMeal: string;
  strMeal: string;
}

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'customNode',
    position: { x: 250, y: 250 },
    data: { label: 'Explore', type: 'start' },
  },
];

const initialEdges: Edge[] = [];

function App() {
  const { getCategories, getMealsByCategory, getMealDetails, getMealsByIngredient } = useMealsAPI();
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [sidebarContent, setSidebarContent] = useState(null);

  const onNodesChange = (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds));
  const onEdgesChange = (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds));
  const onConnect = (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds));

  const handleNodeClick = async (node: Node) => {
    if (node.data.type === 'start') {
      const categories: Category[] = await getCategories();
      setNodes((nds) => [
        ...nds,
        ...categories.slice(0, 5).map((cat: Category, index: number) => ({
          id: `cat-${index}`,
          type: 'customNode',
          position: { x: 300, y: 300 + index * 100 },
          data: { label: cat.strCategory, type: 'category' },
        })),
      ]);
    } else if (node.data.type === 'category') {
      const meals: Meal[] = await getMealsByCategory(node.data.label);
      setNodes((nds) => [
        ...nds,
        ...meals.slice(0, 5).map((meal: Meal, index: number) => ({
          id: `meal-${index}`,
          type: 'customNode',
          position: { x: 400, y: 350 + index * 100 },
          data: { label: meal.strMeal, type: 'meal', idMeal: meal.idMeal },
        })),
      ]);
    } else if (node.data.type === 'meal') {
      const mealDetails = await getMealDetails(node.data.idMeal);
      setSidebarContent(mealDetails);
    } else if (node.data.type === 'ingredient') {
      const meals: Meal[] = await getMealsByIngredient(node.data.label);
      setNodes((nds) => [
        ...nds,
        ...meals.slice(0, 5).map((meal: Meal, index: number) => ({
          id: `ingredient-meal-${index}`,
          type: 'customNode',
          position: { x: 500, y: 400 + index * 100 },
          data: { label: meal.strMeal, type: 'meal', idMeal: meal.idMeal },
        })),
      ]);
    }
  };

  return (
    <div className="dndflow">
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onNodeClick={(_, node) => handleNodeClick(node)} // Removed 'event' since it's unused
        >
          <Background />
        </ReactFlow>
        {sidebarContent && <DetailSidebar content={sidebarContent} />}
      </ReactFlowProvider>
      <Sidebar />
    </div>
  );
}

export default App;
