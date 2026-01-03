import Menu from "../components/ui/Menu";
import MenuIcon from "../assets/menu-icon.svg";

export function HomePage(){
    return (
        <div className="h-full w-full">

            <Menu>
                <img src={MenuIcon} className="h-12 w-12 m-4"></img>
            </Menu>
        </div>

    )
}