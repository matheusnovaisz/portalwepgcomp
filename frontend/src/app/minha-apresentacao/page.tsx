"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import ModalEditarCadastro from "@/components/Modals/ModalEdicaoCadastro/ModalEditarCadastro";
import { ProtectedLayout } from "@/components/ProtectedLayout/protectedLayout";
import { getEventEditionIdStorage } from "@/context/AuthProvider/util";
import { SubmissionFileProvider } from "@/context/submissionFile";
import { useAuth } from "@/hooks/useAuth";
import { useSubmission } from "@/hooks/useSubmission";
import { MinhasApresentacoesMock } from "@/mocks/MinhasApresentacoes";
import Listagem, { mapCardList } from "@/templates/Listagem/Listagem";

import "./style.scss";

export default function MinhasApresentacoes() {
  const { title, userArea } = MinhasApresentacoesMock;
  const { user } = useAuth();
  const router = useRouter();

  const {
    submissionList,
    getSubmissions,
    loadingSubmissionList,
    deleteSubmissionById,
    setSubmission,
  } = useSubmission();

  const [searchValue, setSearchValue] = useState<string>("");
  const [sessionsListValues, setSessionsListValues] = useState<any[]>([]);
  const [showEditModal, setShowEditModal] = useState<boolean>(false)
  const [isAddButtonDisabled, setIsAddButtonDisabled] =
    useState<boolean>(false);

  const getSubmissionOnList = (card: any) => {
    const submission = submissionList?.find((v) => v.id === card.id);

    if (submission?.id) {
      setSubmission(submission);
    }
  };

  useEffect(() => {
    const params = {
      eventEditionId: getEventEditionIdStorage() ?? "",
    };

    getSubmissions(params);
  }, []);

  useEffect(() => {
    const filteredSessions = submissionList.filter((submission) => {
      const searchMatch = submission.title
        .toLowerCase()
        .includes(searchValue.trim().toLowerCase());

      if(user?.level === "Superadmin"){
        setShowEditModal(searchMatch)
        return searchMatch; 
      };

      return submission.mainAuthorId === user?.id && searchMatch;
    });

    setSessionsListValues(filteredSessions);

    if (user?.level !== "Superadmin") {
      const hasOwnSubmission = filteredSessions.length > 0;
      setIsAddButtonDisabled(hasOwnSubmission);
      setShowEditModal(hasOwnSubmission)
    }
  }, [searchValue, submissionList, user]);

  const handleDelete = async (submissionId: string) => {
    if (user?.level === "Superadmin") {
      await deleteSubmissionById(submissionId);

      const updatedSubmissions = sessionsListValues.filter(
        (submission) => submission.id !== submissionId
      );

      setSessionsListValues(updatedSubmissions);
    } else {
      const submission = submissionList.find(
        (submission) => submission.id === submissionId
      );

      if (submission?.mainAuthorId === user?.id) {
        await deleteSubmissionById(submissionId);

        const updatedSubmissions = sessionsListValues.filter(
          (submission) => submission.id !== submissionId
        );

        setSessionsListValues(updatedSubmissions);
        setIsAddButtonDisabled(false);
      }
    }
  };

  const handleEdit = async (submissionId: string) => {
    const submission = sessionsListValues.find((s) => s.id === submissionId);
    setSubmission(submission);
  };

  return (
    <SubmissionFileProvider>
      <ProtectedLayout>
        <div className="d-flex flex-column before-list">
          <Listagem
            title={title}
            labelAddButton={userArea.add}
            searchValue={searchValue}
            onChangeSearchValue={(value) => setSearchValue(value)}
            searchPlaceholder={userArea.search}
            cardsList={mapCardList(sessionsListValues, "title", "abstract")}
            isLoading={loadingSubmissionList}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onClickItem={getSubmissionOnList}
            isAddButtonDisabled={isAddButtonDisabled}
            idModal={showEditModal ? "editarApresentacaoModal" : ""}
            onAddButtonClick={() => router.push("/cadastro-apresentacao")}
            onClear={() => setSubmission(null)}
            isMyPresentation={true}
          />
          <ModalEditarCadastro />
        </div>
      </ProtectedLayout>
    </SubmissionFileProvider>
  );
}
