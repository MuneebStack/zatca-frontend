import { Card, Button, Descriptions } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { axiosClient } from "@/services/axiosClient";
import type { UserType } from "@/types/user";
import { formatDate } from "@/utils/dateFormatter";

const ViewUser = () => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<UserType>();
    const navigate = useNavigate();
    const params = useParams();

    useEffect(() => {
        if (params.id) {
            const controller = new AbortController();

            axiosClient
                .get(`portal/users/${params.id}`)
                .then(({ data: responseData }) => {
                    const payload = responseData?.data;

                    if (payload) {
                        setUser(payload.data)
                    }
                })
                .catch(error => (error))
                .finally(() => setLoading(false))

            return () => controller.abort();
        }
    }, [params.id])

    return (
        <>
            <Card
                title={
                    <div className="flex justify-between items-center">
                        <span>User Details</span>
                        <div>
                            <Button
                                icon={<ArrowLeftOutlined />}
                                onClick={() => navigate(-1)}
                                style={{ marginRight: 8 }}
                            >
                                Back
                            </Button>
                        </div>
                    </div>
                }
                loading={loading}
            >
                {user && (
                    <Descriptions
                        bordered
                        column={1}
                        size="middle"
                        items={[
                            {
                                key: "name",
                                label: <strong>Name</strong>,
                                children: user.name,
                            },
                            {
                                key: "email",
                                label: <strong>Email</strong>,
                                children: user.email,
                            },
                            {
                                key: "created_at",
                                label: <strong>Created At</strong>,
                                children: formatDate(user?.created_at)
                            },
                            {
                                key: "updated_at",
                                label: <strong>Last Updated</strong>,
                                children: formatDate(user.updated_at)
                            },
                        ]}
                    />
                )}
            </Card>
        </>
    );
}

export {
    ViewUser
};