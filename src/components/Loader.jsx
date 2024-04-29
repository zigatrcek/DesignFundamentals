
import { Html } from '@react-three/drei'; //supports non-3D elements in a 3D scene

function Loader() {
    return (
        <div className="flex justify-center items-center">
            <div className="w-20 h-20 border-2 opacity-20 border-blue-500 border-t-blue rounded-full animate-spin" />
        </div>
    );
}

export default Loader;
