import { MENU_ITEMS } from "@/constants";
import { useEffect, useRef, useLayoutEffect } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { actionItemClick } from '@/slice/menuSlice'
import { socket } from "@/socket";
import {imageDataToBase64,base64ToImageData} from '@/components/Board/help'

const Board = () => {
    const dispatch = useDispatch();
    const canvasRef = useRef(null);
    const shouldDraw = useRef(false);
    const drawHistory = useRef([]);
    const historyPointer = useRef(0);
    const { activeMenuItem, actionMenuItem } = useSelector((state) => state.menu);
    const { color, size } = useSelector((state) => state.toolBox[activeMenuItem]);

    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (actionMenuItem === MENU_ITEMS.DOWNLOAD) {
            const url = canvas.toDataURL();
            const anchor = document.createElement('a');
            anchor.href = url;
            anchor.download = 'sketch.png';
            anchor.click();
        } else if (actionMenuItem === MENU_ITEMS.UNDO) {
            if (historyPointer.current > 0) historyPointer.current -= 1;
            const imageData = drawHistory.current[historyPointer.current];
            context.putImageData(imageData, 0, 0);
            const base64ImageData = imageDataToBase64(imageData);   
            // Emitting undo socket event to server
            socket.emit('undoClick', {actionMenuItem,base64ImageData});
        } else if (actionMenuItem === MENU_ITEMS.REDO) {
            if (historyPointer.current < drawHistory.current.length - 1) historyPointer.current += 1;
            const imageData = drawHistory.current[historyPointer.current];
            context.putImageData(imageData, 0, 0);
            const base64ImageData = imageDataToBase64(imageData);
            socket.emit('redoClick', {actionMenuItem,base64ImageData});
        }
        dispatch(actionItemClick(null));

        //Socket code for action menu item
        const handleActionClick = (arg) => {
            console.log("heeldk");
            if(arg.actionMenuItem === MENU_ITEMS.UNDO) {
                base64ToImageData(arg.base64ImageData, (imageData) => {
                    context.putImageData(imageData, 0, 0);
                });
            } else if (arg.actionMenuItem === MENU_ITEMS.REDO) {
                base64ToImageData(arg.base64ImageData, (imageData) => {
                    context.putImageData(imageData, 0, 0);
                });
            }  
        }
        socket.on('undoClick', handleActionClick);
        socket.on('redoClick', handleActionClick);
        
        return () => {
            socket.off('undoClick', handleActionClick);
            socket.off('redoClick', handleActionClick);
        }

    }, [actionMenuItem, dispatch]);

    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const changeConfig = (color, size) => {
            context.strokeStyle = color;
            context.lineWidth = size;
        };
        changeConfig(color, size);
        const handleChangeConfig = (config) => {
            changeConfig(config.color, config.size);
        }
        socket.on('changeConfig', handleChangeConfig);

        return () => {
            socket.off('changeConfig', handleChangeConfig);
        }
    }, [color, size]);

    // Before component mounts
    useLayoutEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const beginPath = (x, y) => {
            context.beginPath();
            context.moveTo(x, y);
        }

        const drawLine = (x, y) => {
            context.lineTo(x, y);
            context.stroke();
        }
        const handleMouseDown = (e) => {
            shouldDraw.current = true;
            beginPath(e.clientX, e.clientY)
            socket.emit('beginPath', { x: e.clientX, y: e.clientY });
        };
        const handleMouseMove = (e) => {
            if (!shouldDraw.current) return;
            drawLine(e.clientX, e.clientY);
            socket.emit('drawLine', { x: e.clientX, y: e.clientY });
        };
        const handleMouseUp = (e) => {
            shouldDraw.current = false;
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            drawHistory.current.push(imageData);
            historyPointer.current = drawHistory.current.length - 1;
        };

        const handleBeginPath = (path) => {
            beginPath(path.x, path.y);
        }

        const handleDrawLine = (path) => {
            drawLine(path.x, path.y);
        }

        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseup', handleMouseUp);

        // Socket Code
        socket.on('beginPath', handleBeginPath);
        socket.on('drawLine', handleDrawLine);

        return () => {
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseup', handleMouseUp);
            socket.off('beginPath', handleBeginPath);
            socket.off('drawLine', handleDrawLine);
        }
    }, [])
    return (
        <canvas ref={canvasRef}></canvas>
    )
}

export default Board