import TrainerAssessmentHighlights from "@/components/common/UI/AssessmentCard";
import AssignedBatchesCard from "@/components/common/UI/AssignedBatchesCard";
import useAuth from "@/hooks/useAuth";
import StatCard from "@/layouts/StatCard";
import assessmentService from "@/services/assessmentService";
import batchService from "@/services/batchService";
import trainerService from "@/services/trainerService";
import { FileEdit, FolderCheck, Layers2, Users } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const TrainerDashboardPage = () => {
  const user = useAuth().user;
  const [trainer, setTrainer] = useState(null);
  const [allAssessments, setAllAssessments] = useState([]);
  const [allBatches, setallBatches] = useState([]);

  const fetchTrainer = async () => {
    try {
      const response = await trainerService.getTrainerByUserId(user.userId);
      setTrainer(response.data || []);
      setallBatches(response.data?.assigned_Batches);
      return response.data || [];
    } catch (error) {
      if (error && error.response.status === 404) {
        toast.warn("Trainer is not found");
      } else toast.error("Error in fetchTrainer");
      console.log("Error in  fetchTrainer", error);
    }
  };

  const fetchAllAssessments = async (trainer) => {
    try {
      const response = await assessmentService.getAllAssessmentsByTrainerId(
        trainer?._id
      );
      setAllAssessments(response.data || []);
    } catch (error) {
      toast.error("Error in fetching allAssessments");
      console.log("Error in fetching allAssessments", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const trainer = await fetchTrainer();
        fetchAllAssessments(trainer);
        // if(user.role === 'technical')fetchAllProjects(trainer);
      } catch (error) {
        console.log("Error in useEffect", error);
      }
    };
    fetchData();
  }, []);

  //Stats data
  const trainerStatCards = [
    {
      title: "Assigned Batches",
      count: trainer?.assigned_Batches?.length,
      icon: <Layers2 size={18} />,
    },
    {
      title: "Total Students",
      count: trainer?.assigned_Batches.reduce((acc, batch) => {
        return acc + (batch.students?.length || 0);
      }, 0),
      icon: <Users size={18} />,
    },
    {
      title: "Assessments Created",
      count: allAssessments.length,
      icon: <FileEdit size={18} />,
    },
  ];

  return (
    <>
      <StatCard cards={trainerStatCards} />
      <div className="container mt-2 pb-5">
        <div className="row ">
          <div className="col-md-6 d-flex">
            <TrainerAssessmentHighlights assessments={allAssessments} />
          </div>
          <div className="col-md-6 d-flex">
            <AssignedBatchesCard
              assignedBatches={allBatches}
              trainerId={trainer?.id}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default TrainerDashboardPage;
