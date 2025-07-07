import { useSafeAreaInsets } from "react-native-safe-area-context";


const useInsets = () => {
    const insets = useSafeAreaInsets();
    
    return insets;
}

export default useInsets;