import { MENU_ITEMS } from "@/constants";
import { useEffect, useRef, useLayoutEffect } from "react"
import { useDispatch, useSelector } from 'react-redux'
import {menuItemClick, actionItemClick} from '@/slice/menuSlice'

const Board = () => {
    const dispatch = useDispatch();
    const canvasRef = useRef(null);
    const shouldDraw = useRef(false);
    const {activeMenuItem, actionMenuItem} = useSelector((state) => state.menu);
    const { color, size } = useSelector((state) => state.toolBox[activeMenuItem]);

    useEffect(()=>{
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if(actionMenuItem === MENU_ITEMS.DOWNLOAD) {
            const url = canvas.toDataURL();
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = 'sketch.png';
            anchor.click();
        }
        dispatch(actionItemClick(null));
    },[actionMenuItem, dispatch]);

    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const changeConfig = () => {
            context.strokeStyle = color;
            context.lineWidth = size;
        };
        changeConfig();
    }, [color, size]);

    // Before component mounts
    useLayoutEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const beginPath = (x,y) => {
            context.beginPath();
            context.moveTo(x,y);
        }

        const drawLine = (x,y) => {
            context.lineTo(x, y);
            context.stroke();
        }
        const handleMouseDown = (e) => {
            shouldDraw.current = true;
            beginPath(e.clientX, e.clientY)
        };
        const handleMouseMove = (e) => {
            if(!shouldDraw.current) return;
            drawLine(e.clientX, e.clientY)
        };
        const handleMouseUp = (e) => {
            shouldDraw.current=false;
        };
        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseup', handleMouseUp);

        return () => {
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseup', handleMouseUp);
        }
    }, [])
    return (
        <canvas ref={canvasRef}></canvas>
    )
}

export default Board