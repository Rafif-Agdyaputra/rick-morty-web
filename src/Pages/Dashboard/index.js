import React, {useCallback, useEffect, useState} from "react";
import {useApolloClient} from "@apollo/client";
import {GET_ALL_CHARACTERS} from "../../Services/Character/character.queries";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Heading,
  Image, Link,
  Skeleton,
  Stack,
  Tag,
  Text,
  useToast
} from "@chakra-ui/react";
import {Status} from "../../Helpers/status.enum";
import {Gender} from "../../Helpers/gender.enum";
import Detail from "../../Services/Detail";

const Dashboard = () => {
  const client = useApolloClient();
  const toast = useToast();
  const [listCharacters, setListCharacters] = useState([]);
  const [info, setInfo] = useState({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [id, setId] = useState('');

  const handleGetListCharacters = useCallback(async () => {
    setLoading(true);
    await client.query({
      fetchPolicy: 'no-cache',
      query: GET_ALL_CHARACTERS,
      variables: {
        page,
      },
    }).then((val) => {
      setLoading(false);
      setInfo(val?.data?.characters?.info);
      setListCharacters(val?.data?.characters?.results);
    }, reason => {
      setLoading(false);
      toast({
        title: reason,
        position: 'top',
        status: 'error',
        isClosable: true,
        duration: 3000
      })
    })
  }, [client, page, toast]);

  useEffect(() => {
    handleGetListCharacters()
  }, [handleGetListCharacters]);

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
      <Heading as="h1" size="lg">The Rick and Morty</Heading>
      <Detail
        id={id}
        isOpen={showDetail}
        onClose={() => setShowDetail(false)}/>
      {loading && (
        <Stack>
          <Skeleton height="150px" />
          <Skeleton height="150px" />
          <Skeleton height="150px" />
        </Stack>
      )}
      {!loading && listCharacters.map((value, index) => (
        <Card
          direction={{ base: 'column', sm: 'row' }}
          overflow='hidden'
          variant='outline'
          background="#515151"
          key={index}
        >
          <Image
            objectFit='cover'
            maxW={{ base: '100%', sm: '200px' }}
            src={value?.image}
            alt='Caffe Latte'
          />

          <Stack>
            <CardBody>
              <Box display="flex" flexDirection="column" gap="2">
                <Heading as="h5" color="white">{value?.name}</Heading>
                <Box display="flex" flexDirection="row" gap="2" alignItems="center">
                  <Tag
                    variant="solid"
                    size="sm"
                    width="fit-content"
                    colorScheme={value?.status === Status.Alive ? 'green' : value?.status === Status.Dead ? 'red' : 'gray'}
                  >{value?.status}</Tag>
                  <Tag variant="solid" size="sm" width="fit-content" colorScheme="yellow">{value?.species}</Tag>
                  <Tag
                    variant="solid"
                    size="sm"
                    width="fit-content"
                    colorScheme={value?.gender === Gender.Male ? 'blue' : value?.gender === Gender.Female ? 'pink' : 'gray'}
                  >{value?.gender}</Tag>
                </Box>
              </Box>
            </CardBody>

            <CardFooter>
              <Button
                variant='solid'
                colorScheme='teal'
                onClick={() => {
                  setShowDetail(true);
                  setId(value?.id);
                }}>
                Detail
              </Button>
            </CardFooter>
          </Stack>
        </Card>
      ) )}
      <Stack direction="row" spacing={4} justifyContent="center" alignItems="center">
        <Button
          colorScheme='teal'
          variant='outline'
          onClick={() => {
            if (info?.next >= 3) {
              setPage(page - 1);
            }
          }}
        >
          Prev
        </Button>
        <Text>{info?.next - 1}</Text>
        <Button
          colorScheme='teal'
          variant='solid'
          onClick={() => {
            setPage(page + 1);
          }}
        >
          Next
        </Button>
      </Stack>
      <Text color="teal">Made By Rafif Agdyaputra</Text>
      <Text color="teal">Thanks to
        <Link color="blue" href="https://rickandmortyapi.com">https://rickandmortyapi.com</Link>
      </Text>
    </div>
  );
};

export default Dashboard;
