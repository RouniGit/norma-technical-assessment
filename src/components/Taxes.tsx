import { yupResolver } from "@hookform/resolvers/yup";
import { Delete } from "@mui/icons-material";
import {
  AppBar,
  Button,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import React, { useMemo } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { TextFieldElement } from "react-hook-form-mui";
import * as yup from "yup";
import * as Calculations from "../helpers/calculations";
import * as FormTypes from "../types/formTypes";

export const Taxes: React.FC = () => {
  const validationSchema: yup.ObjectSchema<FormTypes.Taxes> = yup.object({
    rows: yup
      .array()
      .of(
        yup.object({
          type: yup.string().required(),
          year: yup.number().required().min(1900).max(2100).integer(),

          monthlySalary: yup.number().required().min(0),

          hourlyRate: yup.number().required().min(0),
          hoursPerDay: yup.number().min(0).max(24).integer(),
          daysPerYear: yup.number().min(0).max(356).integer(),
        })
      )
      .defined(),
  });

  const { control, handleSubmit } = useForm({
    defaultValues: {
      rows: [],
    },
    resolver: yupResolver(validationSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "rows",
  });

  const onClickAppendRow = (type: string) => {
    switch (type) {
      case "permanent":
        append({ type, monthlySalary: 0, year: 1900 });
        break;
      case "freelancer":
        append({
          type,
          hourlyRate: 0,
          hoursPerDay: 0,
          daysPerYear: 0,
          year: 1900,
        });
        break;
    }
  };

  const rows = useWatch({
    control,
    name: "rows",
  });

  const total = useMemo(() => {
    const monthlySalaryTotal = Calculations.getPermanentTaxesAnnualizedTotal(
      rows.filter((row) => row.type === "permanent") as FormTypes.PermanentTaxesRow[]
    );
    const freelancerTotal = Calculations.getFreelancerTaxesAnnualizedTotal(
      rows.filter((row) => row.type === "freelancer") as FormTypes.FreelancerTaxesRow[]
    );
    return monthlySalaryTotal + freelancerTotal;
  }, [rows]);

  const totalAfterTaxes = useMemo(() => {
    const monthlySalaryTotalAfterTaxes = Calculations.getPermanentTaxesAnnualizedTotalAfterTaxes(
      rows.filter((row) => row.type === "permanent") as FormTypes.PermanentTaxesRow[]
    );
    const freelancerTotalAfterTaxes = Calculations.getFreelancerTaxesAnnualizedTotalAfterTaxes(
      rows.filter((row) => row.type === "freelancer") as FormTypes.FreelancerTaxesRow[]
    );
    return monthlySalaryTotalAfterTaxes + freelancerTotalAfterTaxes;
  }, [rows]);

  return (
    <Stack>
      <AppBar>
        <Toolbar>Calcul des taxes</Toolbar>
      </AppBar>
      <Toolbar />
      <Stack
        component="form"
        onSubmit={handleSubmit(
          () => {
            console.log("success");
          },
          () => {
            console.log("error");
          }
        )}
        marginTop={2}
        marginX={2}
        border={1}
        borderColor="lightgray"
        borderRadius={2}
        padding={2}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Salaire par mois</TableCell>
                <TableCell>Taux horaire</TableCell>
                <TableCell>Heures par jour</TableCell>
                <TableCell>Jours par an</TableCell>
                <TableCell>Année</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {fields.map((field, index) => (
                <TableRow key={field.id}>
                  {field.type === "permanent" && (
                    <>
                      <TableCell>
                        <TextFieldElement
                          control={control}
                          name={`rows.${index}.monthlySalary`}
                          InputProps={{
                            endAdornment: <InputAdornment position="end">€/ mois</InputAdornment>,
                          }}
                        />
                      </TableCell>
                      <TableCell />
                      <TableCell />
                      <TableCell />
                    </>
                  )}
                  {field.type === "freelancer" && (
                    <>
                      <TableCell />
                      <TableCell>
                        <TextFieldElement
                          control={control}
                          name={`rows.${index}.hourlyRate`}
                          InputProps={{
                            endAdornment: <InputAdornment position="end">€/ heure</InputAdornment>,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextFieldElement control={control} name={`rows.${index}.hoursPerDay`} />
                      </TableCell>
                      <TableCell>
                        <TextFieldElement control={control} name={`rows.${index}.daysPerYear`} />
                      </TableCell>
                    </>
                  )}
                  <TableCell>
                    <TextFieldElement control={control} name={`rows.${index}.year`} InputProps={{ inputProps: { min: 1900 } }} />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => remove(index)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Stack direction="row" justifyContent="center" spacing={2} marginY={2}>
          <Button onClick={() => onClickAppendRow("permanent")} sx={{ alignSelf: "center", marginTop: 2 }}>
            Ajouter un revenu de CDI
          </Button>
          <Button onClick={() => onClickAppendRow("freelancer")} sx={{ alignSelf: "center", marginTop: 2 }}>
            Ajouter un revenu de Freelance
          </Button>
        </Stack>
        <Typography variant="h6">Total : {total} €</Typography>
        <Typography variant="h6">Total après taxes : {totalAfterTaxes} €</Typography>
      </Stack>
    </Stack>
  );
};
