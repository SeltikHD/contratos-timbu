"use client";

import { useState } from "react";

interface ProfileEditFormProps {
    readonly userProfile: any;
}

export function ProfileEditForm({ userProfile }: ProfileEditFormProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button className="btn btn-primary" onClick={() => setIsOpen(true)}>
                Editar Perfil
            </button>

            {isOpen && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg mb-4">Editar Perfil</h3>

                        <div className="space-y-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Nome</span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered"
                                    defaultValue={userProfile.user.name || ""}
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Bio</span>
                                </label>
                                <textarea
                                    className="textarea textarea-bordered h-24"
                                    placeholder="Conte um pouco sobre você..."
                                    defaultValue={userProfile.profile?.bio || ""}
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Empresa</span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered"
                                    placeholder="Nome da empresa"
                                    defaultValue={userProfile.profile?.company || ""}
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Localização</span>
                                </label>
                                <input
                                    type="text"
                                    className="input input-bordered"
                                    placeholder="Cidade, Estado"
                                    defaultValue={userProfile.profile?.location || ""}
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Website</span>
                                </label>
                                <input
                                    type="url"
                                    className="input input-bordered"
                                    placeholder="https://seusite.com"
                                    defaultValue={userProfile.profile?.website || ""}
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Telefone</span>
                                </label>
                                <input
                                    type="tel"
                                    className="input input-bordered"
                                    placeholder="(11) 99999-9999"
                                    defaultValue={userProfile.profile?.phone || ""}
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">LinkedIn</span>
                                </label>
                                <input
                                    type="url"
                                    className="input input-bordered"
                                    placeholder="https://linkedin.com/in/seuperfil"
                                    defaultValue={userProfile.profile?.linkedin || ""}
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">GitHub</span>
                                </label>
                                <input
                                    type="url"
                                    className="input input-bordered"
                                    placeholder="https://github.com/seuusuario"
                                    defaultValue={userProfile.profile?.github || ""}
                                />
                            </div>
                        </div>

                        <div className="modal-action">
                            <button className="btn btn-ghost" onClick={() => setIsOpen(false)}>
                                Cancelar
                            </button>
                            <button className="btn btn-primary">Salvar</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
