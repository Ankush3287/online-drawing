import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faEraser, faRotateLeft, faRotateRight, faFileArrowDown } from '@fortawesome/free-solid-svg-icons'
import styles from './index.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { MENU_ITEMS } from '@/constants'
import { menuItemClick, actionItemClick } from '@/slice/menuSlice'
import cx from 'classnames'
import { socket } from "@/socket";
import { useEffect } from 'react'

const Menu = () => {
  const dispatch = useDispatch();
  const activeMenuItem = useSelector((state) => state.menu.activeMenuItem);
  const handleMenuClick = (itemName) => {
    dispatch(menuItemClick(itemName));
    socket.emit('menuClick', itemName);
  }

  const handleActionItemClick = (itemName) => {
    dispatch(actionItemClick(itemName));
  }

  // Socket code for menu active items
  useEffect(() => {
    const handleMenuClickSocket = (itemName) => {
      dispatch(menuItemClick(itemName));
    }
    socket.on('menuClick', handleMenuClickSocket);
    return () => {
      socket.off('menuClick', handleMenuClickSocket);
    }
  }, [activeMenuItem]);

  return (
    <div className={styles.menuContainer}>
      <div className={cx(styles.iconWrapper, { [styles.active]: activeMenuItem === MENU_ITEMS.PENCIL })} onClick={() => handleMenuClick(MENU_ITEMS.PENCIL)}>
        <FontAwesomeIcon icon={faPencil} className={styles.icon} />
      </div>
      <div className={cx(styles.iconWrapper, { [styles.active]: activeMenuItem === MENU_ITEMS.ERASER })} onClick={() => handleMenuClick(MENU_ITEMS.ERASER)}>
        <FontAwesomeIcon icon={faEraser} className={styles.icon} />
      </div>
      <div className={styles.iconWrapper} onClick={() => handleActionItemClick(MENU_ITEMS.UNDO)}>
        <FontAwesomeIcon icon={faRotateLeft} className={styles.icon} />
      </div>
      <div className={styles.iconWrapper} onClick={() => handleActionItemClick(MENU_ITEMS.REDO)}>
        <FontAwesomeIcon icon={faRotateRight} className={styles.icon} />
      </div>
      <div className={styles.iconWrapper} onClick={() => handleActionItemClick(MENU_ITEMS.DOWNLOAD)}>
        <FontAwesomeIcon icon={faFileArrowDown} className={styles.icon} />
      </div>
    </div>
  )
}

export default Menu