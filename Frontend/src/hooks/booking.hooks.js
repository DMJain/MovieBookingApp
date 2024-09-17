import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiInstance } from "../api";

export const useCreatreBooking = () => {
    const queryClient = useQueryClient();
  
    const mutation = useMutation({
      mutationFn: async ({ showId, seatNumber, paymentId, userId }) => {
        const { data } = await apiInstance.post("/booking/createBooking", {
            showId,
            seatNumber,
            paymentId,
            userId,
        });

        return data;
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ["booking"] });
      },
    });
    return mutation;
  };

  export const useGetAllShowBooking = () => {
    const queryClient = useQueryClient();
  
    const mutation = useMutation({
      mutationFn: async ({showId}) => {
        const { data } = await apiInstance.post("/booking/show", {
            showId,
        });

        return data;
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ["booking"] });
      },
    });
    return mutation;
  };

