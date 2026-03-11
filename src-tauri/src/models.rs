use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct Task {
    pub id: i64,
    pub name: String,
    pub datetime: chrono::DateTime<chrono::Utc>,
}
