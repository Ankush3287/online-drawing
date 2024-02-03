import styles from './index.module.css'
import { COLORS, MENU_ITEMS } from '@/constants'
import {useDispatch,useSelector} from 'react-redux'
import { changeColor, changeBrushSize } from '@/slice/toolBoxSlice'
import cx from 'classnames';
import { socket } from "@/socket";


const Toolbox = () => {
    const dispatch = useDispatch();
    const activeMenuItem = useSelector((state)=> state.menu.activeMenuItem);
    const {color, size}= useSelector((state)=> state.toolBox[activeMenuItem])
    const showStrokeToolOption = activeMenuItem===MENU_ITEMS.PENCIL;
    const showBrushToolOption = activeMenuItem===MENU_ITEMS.PENCIL || activeMenuItem===MENU_ITEMS.ERASER;
    const updateBrushSize = (e) =>{
        dispatch(changeBrushSize({item: activeMenuItem, size: e.target.value}));
        socket.emit('changeConfig', {color, size: e.target.value});
    }
    const updateColor = (newColor) =>{
        dispatch(changeColor({item: activeMenuItem, color: newColor}));
        socket.emit('changeConfig', {color:newColor, size});
    }
  return (
    <div className={styles.toolboxContainer}>
        {showStrokeToolOption &&         <div className={styles.toolItem}>
            <h4 className={styles.toolText}>Stroke Color</h4>
            <div className={styles.itemContainer}>
                <div className={cx(styles.colorBox,{[styles.active]: color===COLORS.BLACK})} style={{background: COLORS.BLACK}} onClick={()=> updateColor(COLORS.BLACK)} />
                <div className={cx(styles.colorBox,{[styles.active]: color===COLORS.RED})} style={{background: COLORS.RED}} onClick={()=> updateColor(COLORS.RED)}/>
                <div className={cx(styles.colorBox,{[styles.active]: color===COLORS.GREEN})}style={{background: COLORS.GREEN}} onClick={()=> updateColor(COLORS.GREEN)}/>
                <div className={cx(styles.colorBox,{[styles.active]: color===COLORS.BLUE})}style={{background: COLORS.BLUE}} onClick={()=> updateColor(COLORS.BLUE)}/>
                <div className={cx(styles.colorBox,{[styles.active]: color===COLORS.ORANGE})} style={{background: COLORS.ORANGE}} onClick={()=> updateColor(COLORS.ORANGE)}/>
                <div className={cx(styles.colorBox,{[styles.active]: color===COLORS.YELLOW})}style={{background: COLORS.YELLOW}} onClick={()=> updateColor(COLORS.YELLOW)}/>
            </div>
        </div>}
        {showBrushToolOption && <div className={styles.toolItem}>
            <h4 className={styles.toolText}>Brush Size</h4>
            <div className={styles.itemContainer}>
                <input type="range" min={1} max={10} step={1} onChange={updateBrushSize} value={size} />
            </div>
        </div>}
        
    </div>
  )
}

export default Toolbox