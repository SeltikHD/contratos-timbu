export default function Header() {
    return (
        <header className="bg-base-100 shadow-lg border-b border-base-300">
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="avatar placeholder">
                            <div className="bg-primary text-primary-content w-10 rounded-full">
                                <span className="text-sm font-bold">CT</span>
                            </div>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-primary">Contratos Timbu</h1>
                            <p className="text-sm text-base-content/70">
                                Sistema de Gestão de Contratos
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                                <div className="indicator">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M15 17h5l-5 5v-5zM10.5 14H21l-5.5 5.5L10.5 14z"
                                        />
                                    </svg>
                                    <span className="badge badge-sm indicator-item">8</span>
                                </div>
                            </div>
                        </div>

                        <div className="dropdown dropdown-end">
                            <div
                                tabIndex={0}
                                role="button"
                                className="btn btn-ghost btn-circle avatar"
                            >
                                <div className="w-8 rounded-full">
                                    <div className="avatar placeholder">
                                        <div className="bg-secondary text-secondary-content w-8 rounded-full">
                                            <span className="text-xs">U</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <ul className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                                <li>
                                    <a href="/perfil" className="justify-between">
                                        Perfil{" "}
                                        <span className="badge">Novo</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="/configuracoes">Configurações</a>
                                </li>
                                <li>
                                    <a href="/sair">Sair</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
