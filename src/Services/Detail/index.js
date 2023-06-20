import React, {useCallback, useEffect, useState} from 'react';
import {
  Box,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tag,
  useToast,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Card,
  CardBody,
  Text,
} from "@chakra-ui/react";
import {useApolloClient} from "@apollo/client";
import {GET_CHARACTER_BY_ID} from "../Character/character.queries";
import {Status} from "../../Helpers/status.enum";
import {Gender} from "../../Helpers/gender.enum";

const Detail = ({isOpen, onClose, id}) => {
  const client = useApolloClient();
  const toast = useToast();
  const [character, setCharacter] = useState({});
  const [loading, setLoading] = useState(false);

  const handleGetCharacter = useCallback(async () => {
    setLoading(true);
    try {
      client.query({
        fetchPolicy: 'no-cache',
        query: GET_CHARACTER_BY_ID,
        variables: {
          id: id
        },
      }).then((val) => {
        setLoading(false);
        setCharacter(val?.data?.character);
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
    } catch (e) {
      setLoading(false);
      toast({
        title: e,
        position: 'top',
        status: 'error',
        isClosable: true,
        duration: 3000
      })
    }
  }, [client, id, toast]);

  useEffect(() => {
    if (id) {
      handleGetCharacter();
    }
  }, [handleGetCharacter, id]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      {!loading && (
        <ModalContent>
          <ModalHeader>{character?.name}</ModalHeader>
          <ModalCloseButton/>
          <ModalBody>
            <Image
              width="100%"
              src={character?.image}
              alt={character?.name}
            />
            <Box display="flex" flexDirection="row" gap="2" alignItems="center" mt={2}>
              <Tag
                variant="solid"
                size="sm"
                width="fit-content"
                colorScheme={character?.status === Status.Alive ? 'green' : character?.status === Status.Dead ? 'red' : 'gray'}
              >{character?.status}</Tag>
              <Tag variant="solid" size="sm" width="fit-content" colorScheme="yellow">{character?.species}</Tag>
              <Tag
                variant="solid"
                size="sm"
                width="fit-content"
                colorScheme={character?.gender === Gender.Male ? 'blue' : character?.gender === Gender.Female ? 'pink' : 'gray'}
              >{character?.gender}</Tag>
            </Box>
            <Tabs variant='enclosed' colorScheme='green' mt={3}>
              <TabList>
                <Tab>Origins</Tab>
                <Tab>Location</Tab>
                <Tab>Episode</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  {character?.origin?.name ? character?.origin?.name : '-'}
                </TabPanel>
                <TabPanel>
                  {character?.location?.name}
                </TabPanel>
                <TabPanel draggable>
                  {character?.episode?.map((eps, index) => (
                    <Card>
                      <CardBody>
                        <Text>Name: {eps?.name}</Text>
                        <Text>Air Date: {eps?.air_date}</Text>
                        <Text>Episode: {eps?.episode}</Text>
                      </CardBody>
                    </Card>
                  ))}
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
        </ModalContent>)}
    </Modal>
  );
};

export default Detail;
